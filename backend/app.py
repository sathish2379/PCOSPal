import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import openai
import firebase_admin
from firebase_admin import credentials, auth, firestore
from flask import Flask, request, jsonify
from firebase_admin.exceptions import FirebaseError
import os
from dotenv import load_dotenv
import json

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH")

firebase_credentials = json.loads(FIREBASE_CREDENTIALS_PATH)

# Initialize Firebase
cred = credentials.Certificate(firebase_credentials)
firebase_admin.initialize_app(cred)

# Access Firestore
db = firestore.client()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Set up OpenAI API Key
openai.api_key = OPENAI_API_KEY

# Function to get personalized recommendations from OpenAI (chat model)
def get_personalized_recommendations(symptoms_text):
    try:
        # Use the chat-based API (v1/chat/completions) for gpt-3.5-turbo or gpt-4
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Or use "gpt-4" if you have access
            messages = [
                {"role": "system", "content": 
                    """
                    You are a helpful assistant. Your task is to provide personalized recommendations based on the user's symptoms. 
                    When the user shares their symptoms, suggest relevant diet plans, exercises, and lifestyle tips. 
                    Consider the severity of the symptoms (mild, moderate, severe) and tailor your recommendations accordingly.
                    Focus on healthy, balanced, and sustainable habits that align with the user's health concerns.
                    For example, for mild symptoms, suggest simple lifestyle changes, while for severe symptoms, advise caution and more focused advice.
                    Be sure to prioritize practical and actionable advice for the user.
                    """
                },
                {"role": "user", "content": f"""
                    Here are the symptoms: {symptoms_text}. Based on these, please suggest a personalized diet plan, exercises, and lifestyle tips.
                    Consider the severity of the symptoms and offer specific advice for improving overall health. 
                    For example, if the symptoms are mild, suggest general wellness practices, and if they are moderate or severe, provide more targeted recommendations.
                """}
            ],
            temperature=0.7,
            max_tokens=500  # Limit the length of the response
        )
        # Extract the recommendation from the response
        recommendations = response['choices'][0]['message']['content'].strip()
        return recommendations
    except Exception as e:
        return f"Error: {str(e)}"

# Function to get doctor recommendation based on symptoms (chat model)
def get_doctor_recommendation(symptoms_text):
    try:
        # Use the chat-based API (v1/chat/completions) for gpt-3.5-turbo or gpt-4
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Or use "gpt-4" if you have access
            messages = [
                {"role": "system", "content": 
                    """
                    You are a helpful assistant. Your task is to analyze a set of symptoms, their severity, and offer guidance on whether the user should consult a doctor. 
                    Consider the severity of symptoms (mild, moderate, severe) and the combination of symptoms. 
                    If the symptoms seem serious or severe, recommend consulting a doctor. If the symptoms are mild or moderate, suggest lifestyle adjustments or other potential causes.
                    """
                },
                {"role": "user", "content": f"""
                    Here are the symptoms: {symptoms_text}. Please consider the severity of these symptoms (mild, moderate, severe) and advise whether the user should consult a doctor. 
                    Provide relevant advice based on the severity of the symptoms, and explain the reasoning.
                """}
            ],
            temperature=0.7,
            max_tokens=250
        )
        # Extract doctor advice from the response
        doctor_advice = response['choices'][0]['message']['content'].strip()
        return doctor_advice
    except Exception as e:
        return f"Error: {str(e)}"
    
@app.route('/submit_symptoms', methods=['POST'])
def submit_symptoms():
    data = request.get_json()
    user_id = data.get('user_id')
    symptoms = data.get('symptoms')
    date_time = data.get('date_time')  # Expecting ISO format "YYYY-MM-DD HH:MM:SS"

    if not user_id or not symptoms or not date_time:
        return jsonify({'error': 'User ID, symptoms, and date/time are required'}), 400

    # Generate personalized recommendations based on symptoms
    recommendations = get_personalized_recommendations(symptoms)

    # Generate consultation recommendation based on symptoms
    doctor_advice = get_doctor_recommendation(symptoms)

    # Save data to Firebase Firestore
    doc_ref = db.collection('users').document(user_id).collection('symptoms').add({
        'date_time': date_time,
        'symptoms': symptoms,
        'recommendations': recommendations,
        'doctor_advice': doctor_advice
    })

    return jsonify({'message': 'Symptoms logged successfully', 'recommendations': recommendations, 'doctor_advice': doctor_advice})



@app.route('/log_cycle', methods=['POST'])
def log_cycle():
    data = request.get_json()
    user_id = data.get('user_id')
    cycle_info = data.get('cycle_info')  # Expecting {"start_date": "...", "cycle_length": ...}
    date_time = data.get('date_time')  # Expecting ISO format "YYYY-MM-DD HH:MM:SS"

    if not user_id or not cycle_info or not date_time:
        return jsonify({'error': 'User ID, cycle info, and date/time are required'}), 400

    # Save cycle data in Firebase
    doc_ref = db.collection('users').document(user_id).collection('cycles').add({
        'date_time': date_time,
        'cycle_info': cycle_info
    })

    return jsonify({'message': 'Cycle data logged successfully'})

@app.route('/analyze_trends', methods=['POST'])
def analyze_trends():
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    # Fetch the last two symptom records for the user
    user_symptoms = db.collection('symptoms')\
                      .where('user_id', '==', user_id)\
                      .order_by('timestamp', direction=firestore.Query.DESCENDING)\
                      .limit(2).stream()
    
    past_symptoms = [doc.to_dict() for doc in user_symptoms]

    if len(past_symptoms) < 2:
        return jsonify({'trend_analysis': "Not enough history to analyze trends. Keep tracking your symptoms."})

    # Extract symptom sets
    prev1_symptoms = set(past_symptoms[0]['symptoms'])
    prev2_symptoms = set(past_symptoms[1]['symptoms'])

    # Compare past symptoms
    new_symptoms = prev1_symptoms - prev2_symptoms
    resolved_symptoms = prev2_symptoms - prev1_symptoms

    if len(new_symptoms) > len(resolved_symptoms):
        trend_message = "Your symptoms seem to be worsening. Consider consulting a doctor."
    elif len(new_symptoms) < len(resolved_symptoms):
        trend_message = "Your symptoms appear to be improving! Keep following the recommendations."
    else:
        trend_message = "Your symptoms are stable. Keep monitoring and take care of your health."

    return jsonify({'trend_analysis': trend_message})


# Define an endpoint for getting educational resources on PCOS
@app.route('/get_education', methods=['GET'])
def get_education():
    # Example of static content related to PCOS education
    education_resources = [
        {"title": "PCOS Myths", "content": "Common myths about PCOS include..."},
        {"title": "PCOS Treatment Options", "content": "Treatment options for PCOS include..."},
        {"title": "Mental Health and PCOS", "content": "Mental health and its connection with PCOS..."}
    ]
    
    return jsonify(education_resources)


# User Signup Endpoint
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Extract the necessary data
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')

    if not email or not password or not username:
        return jsonify({"error": "All fields are required"}), 400

    try:
        # Create user with Firebase Authentication
        user = auth.create_user(
            email=email,
            password=password,
            display_name=username
        )

        # Store additional user information in Firestore (optional)
        user_ref = db.collection('users').document(user.uid)
        user_ref.set({
            'email': email,
            'username': username,
            'created_at': firestore.SERVER_TIMESTAMP
        })

        return jsonify({"message": "Signup successful"}), 201

    except FirebaseError as e:
        return jsonify({"error": str(e)}), 500


# User Login Endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        # Attempt to sign in the user via Firebase Authentication
        user = auth.get_user_by_email(email)

        # Perform password validation manually using Firebase Authentication
        # Firebase Authentication itself doesn't support password validation directly,
        # so you'll typically implement it on the frontend using Firebase SDK for Web/Android/iOS.

        # If the credentials are correct, generate a token (JWT) for the user
        id_token = auth.create_custom_token(user.uid)

        return jsonify({"message": "Login successful", "token": id_token.decode()}), 200

    except FirebaseError as e:
        return jsonify({"error": "Invalid credentials or user not found"}), 401


# Protected route (to test the JWT token usage)
@app.route('/protected', methods=['GET'])
def protected():
    token = request.headers.get('Authorization').split("Bearer ")[-1]

    if not token:
        return jsonify({"error": "Token is missing"}), 400

    try:
        # Verify the Firebase token
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']

        return jsonify({"message": f"Welcome user with UID {uid}!"}), 200

    except FirebaseError as e:
        return jsonify({"error": "Invalid or expired token"}), 403

@app.route('/test', methods=['GET'])
def test():
    """
    Simple health check API to ensure the app is running.
    """
    return jsonify({'status': 'success', 'message': 'App is running correctly!'}), 200


# Function to test Firestore connection
def test_firestore_connection():
    try:
        # Add a test document to a collection called "testCollection"
        doc_ref = db.collection('testCollection').document('testDocument')
        doc_ref.set({
            'testField': 'This is a test value'
        })

        # Retrieve the test document to confirm it's stored
        retrieved_doc = doc_ref.get()
        if retrieved_doc.exists:
            return {'status': 'success', 'message': 'Test document added and retrieved successfully', 'data': retrieved_doc.to_dict()}
        else:
            return {'status': 'error', 'message': 'Document does not exist'}

    except Exception as e:
        return {'status': 'error', 'message': f'Error: {str(e)}'}

# Route to test Firebase connection
@app.route('/test-firebase', methods=['GET'])
def test_firebase():
    result = test_firestore_connection()
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
