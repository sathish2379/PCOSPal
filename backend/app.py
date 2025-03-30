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
from flask_bcrypt import bcrypt

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH")

# server
firebase_credentials = json.loads(FIREBASE_CREDENTIALS_PATH)
cred = credentials.Certificate(firebase_credentials)

# local
#cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
firebase_admin.initialize_app(cred)

# Access Firestore
db = firestore.client()

# Initialize Flask app
app = Flask(__name__)
CORS(app)
openai.api_key = OPENAI_API_KEY

def get_personalized_recommendations(symptoms_text):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
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
            max_tokens=500
        )
        recommendations = response['choices'][0]['message']['content'].strip()
        return recommendations
    except Exception as e:
        return f"Error: {str(e)}"

def get_doctor_recommendation(symptoms_text):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
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

    username = data.get('username')
    symptoms = data.get('symptoms')
    date_time = data.get('date_time')

    if not username or not symptoms or not date_time:
        return jsonify({'error': 'User ID, symptoms, and date/time are required'}), 400

    recommendations = get_personalized_recommendations(symptoms)

    doctor_advice = get_doctor_recommendation(symptoms)

    doc_ref = db.collection('users').document(username).collection('symptoms').add({
        'date_time': date_time,
        'symptoms': symptoms,
        'recommendations': recommendations,
        'doctor_advice': doctor_advice
    })

    return jsonify({'message': 'Symptoms logged successfully', 'recommendations': recommendations, 'doctor_advice': doctor_advice})


@app.route('/log_cycle', methods=['POST'])
def log_cycle():
    data = request.get_json()
    username = data.get('username')
    cycle_info = data.get('cycle_info')
    date_time = data.get('date_time')

    if not username or not cycle_info or not date_time:
        return jsonify({'error': 'User ID, cycle info, and date/time are required'}), 400

    doc_ref = db.collection('users').document(username).collection('cycles').add({
        'date_time': date_time,
        'cycle_info': cycle_info
    })

    return jsonify({'message': 'Cycle data logged successfully'})

@app.route('/get_user_cycles', methods=['POST'])
def get_user_cycles():
    try:
        data = request.get_json()
        username = data.get('username')

        if not username:
            return jsonify({'error': 'username is required'}), 400

        cycles_ref = db.collection('users').document(username).collection('cycles')
        user_cycles = cycles_ref.stream()

        cycles = []
        for cycle in user_cycles:
            cycle_data = cycle.to_dict()
            cycle_data['id'] = cycle.id
            cycles.append(cycle_data)

        if cycles:
            return jsonify(cycles)
        else:
            return jsonify({'message': 'No cycles found for the user'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# AI has been used for developing this method 
@app.route('/analyze_trends', methods=['POST'])
def analyze_trends():
    data = request.get_json()
    username = data.get('username')

    if not username:
        return jsonify({'error': 'User ID is required'}), 400

    user_symptoms = db.collection('users')\
                      .document(username)\
                      .collection('symptoms')\
                      .order_by('date_time', direction=firestore.Query.DESCENDING)\
                      .limit(2).stream()

    past_symptoms = [doc.to_dict() for doc in user_symptoms]

    if len(past_symptoms) < 2:
        return jsonify({'trend_analysis': "Not enough history to analyze trends. Keep tracking your symptoms."})

    # Initialize sets for symptom names and severity changes
    prev1_symptoms = {symptom['name']: symptom['severity'] for symptom in past_symptoms[0]['symptoms']}
    prev2_symptoms = {symptom['name']: symptom['severity'] for symptom in past_symptoms[1]['symptoms']}

    # Compare past symptoms and calculate severity changes
    new_symptoms = prev1_symptoms.keys() - prev2_symptoms.keys()
    resolved_symptoms = prev2_symptoms.keys() - prev1_symptoms.keys()
    worsening_symptoms = {symptom: prev1_symptoms[symptom] for symptom in prev1_symptoms if symptom in prev2_symptoms and prev1_symptoms[symptom] > prev2_symptoms[symptom]}
    improving_symptoms = {symptom: prev1_symptoms[symptom] for symptom in prev1_symptoms if symptom in prev2_symptoms and prev1_symptoms[symptom] < prev2_symptoms[symptom]}

    # Generate trend message based on the analysis
    if len(new_symptoms) > len(resolved_symptoms):
        trend_message = "Your symptoms seem to be worsening. Consider consulting a doctor."
    elif len(new_symptoms) < len(resolved_symptoms):
        trend_message = "Your symptoms appear to be improving! Keep following the recommendations."
    elif worsening_symptoms:
        trend_message = "Some of your symptoms seem to be worsening. Please take them seriously and consult a doctor if needed."
    elif improving_symptoms:
        trend_message = "Great progress! Your symptoms appear to be improving."
    else:
        trend_message = "Your symptoms are stable. Keep monitoring and take care of your health."

    return jsonify({'trend_analysis': trend_message})

# Define an endpoint for getting educational resources on PCOS
# @app.route('/get_education', methods=['GET'])
# def get_education():
#     # Example of static content related to PCOS education
#     education_resources = [
#         {"title": "PCOS Myths", "content": "Common myths about PCOS include..."},
#         {"title": "PCOS Treatment Options", "content": "Treatment options for PCOS include..."},
#         {"title": "Mental Health and PCOS", "content": "Mental health and its connection with PCOS..."}
#     ]
    
#     return jsonify(education_resources)


def hash_password(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password

def check_password(stored_hash, password):
    return bcrypt.checkpw(password.encode('utf-8'), stored_hash)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    username = data.get('username')


    if not email or not password or not username:
        return jsonify({"error": "All fields are required"}), 400

    try:
        hashed_password = hash_password(password)

        print(username)
        user_ref = db.collection('users').document(username)
        user_ref.set({
            'email': email,
            'username': username,
            'password': hashed_password,
            'created_at': firestore.SERVER_TIMESTAMP
        })

        return jsonify({"message": "Signup successful"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    password = data.get('password')
    username = data.get('username')

    if not password or not username:
        return jsonify({"error": "Username and password are required"}), 400

    try:
        user_ref = db.collection('users').document(username)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 404

        stored_hash = user_doc.to_dict().get('password')

        if not check_password(stored_hash, password):
            return jsonify({"error": "Invalid password"}), 401

        return jsonify({"message": "Login successful"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/test', methods=['GET'])
def test():
    """
    Simple health check API to ensure the app is running.
    """
    return jsonify({'status': 'success', 'message': 'App is running correctly!'}), 200


# Function to test Firestore connection
def test_firestore_connection():
    try:
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

@app.route('/test-firebase', methods=['GET'])
def test_firebase():
    result = test_firestore_connection()
    return jsonify(result)

if __name__ == '__main__':
    # app.run(debug=True)
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)

