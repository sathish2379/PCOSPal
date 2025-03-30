# PCOS & Irregular Period Detector - API Documentation

## Base URL
```
http://your-api-url.com/
```

---

## **1. User Signup**
### **Endpoint:**
```
POST /signup
```
### **Description:**
Registers a new user using a username as the unique identifier and stores user details in Firebase.
### **Request Body:**
```json
{
  "username": "sat2379",
  "email": "user@example.com",
  "password": "securepassword"
}
```
### **Response:**
#### **Success (201)**
```json
{
  "message": "Signup successful"
}
```
#### **Error (400 - Missing fields)**
```json
{
  "error": "All fields are required"
}
```

---

## **2. User Login**
### **Endpoint:**
```
POST /login
```
### **Description:**
Logs in a user using their username and password, returning a session token if successful.
### **Request Body:**
```json
{
  "username": "sat2379",
  "password": "securepassword"
}
```
### **Response:**
#### **Success (200)**
```json
{
  "message": "Login successful",
  "username": "sat2379"
}
```
#### **Error (401 - Invalid credentials)**
```json
{
  "error": "Invalid credentials or user not found"
}
```

---

## **3. Log Symptoms**
### **Endpoint:**
```
POST /log_symptoms
```
### **Description:**
Allows users to log their symptoms, including severity levels.
### **Request Body:**
```json
{
  "username": "sat2379",
  "symptoms": [
    {"name": "acne", "severity": 5},
    {"name": "mood swings", "severity": 3}
  ]
}
```
### **Response:**
#### **Success (201)**
```json
{
  "message": "Symptoms logged successfully"
}
```
#### **Error (400 - Missing fields)**
```json
{
  "error": "Username and symptoms are required"
}
```

---

## **4. Analyze Trends**
### **Endpoint:**
```
POST /analyze_trends
```
### **Description:**
Analyzes a user's symptom trends based on past symptom logs.
### **Request Body:**
```json
{
  "username": "sat2379"
}
```
### **Response:**
#### **Success (200)**
```json
{
  "trend_analysis": "Your symptoms seem to be worsening. Consider consulting a doctor."
}
```
#### **Error (400 - Missing username)**
```json
{
  "error": "User ID is required"
}
```
#### **Error (200 - Not enough history)**
```json
{
  "trend_analysis": "Not enough history to analyze trends. Keep tracking your symptoms."
}
```

---

## **5. Get Symptom History**
### **Endpoint:**
```
GET /symptom_history/<username>
```
### **Description:**
Fetches the logged symptoms for a user.
### **Response:**
#### **Success (200)**
```json
{
  "username": "sat2379",
  "history": [
    {
      "date_time": "2025-03-29 12:30:00",
      "symptoms": [
        {"name": "acne", "severity": 5},
        {"name": "mood swings", "severity": 3}
      ]
    }
  ]
}
```
#### **Error (404 - No records found)**
```json
{
  "error": "No symptom records found for this user."
}
```

---

## **6. Get Personalized Recommendations**
### **Endpoint:**
```
POST /recommendations
```
### **Description:**
Uses AI to generate personalized health recommendations based on symptoms.
### **Request Body:**
```json
{
  "username": "sat2379",
  "symptoms": ["irregular cycles", "acne"]
}
```
### **Response:**
#### **Success (200)**
```json
{
  "recommendations": "Maintain a healthy diet rich in whole grains and lean proteins. Consider consulting a doctor if symptoms persist."
}
```
#### **Error (400 - Missing fields)**
```json
{
  "error": "Username and symptoms are required"
}
```

---

## **7. Delete Symptom Entry**
### **Endpoint:**
```
DELETE /delete_symptom
```
### **Description:**
Deletes a specific symptom entry from a user’s record.
### **Request Body:**
```json
{
  "username": "sat2379",
  "entry_id": "symptom123"
}
```
### **Response:**
#### **Success (200)**
```json
{
  "message": "Symptom entry deleted successfully"
}
```
#### **Error (404 - Entry not found)**
```json
{
  "error": "Symptom entry not found"
}
```

---

## **8. Educational Resources**
### **Endpoint:**
```
GET /resources
```
### **Description:**
Fetches curated educational articles and resources related to PCOS and menstrual health.
### **Response:**
#### **Success (200)**
```json
{
  "resources": [
    {"title": "Managing PCOS Naturally", "url": "https://example.com/pcos"},
    {"title": "Exercise Tips for Hormonal Balance", "url": "https://example.com/exercise"}
  ]
}
```

---

## Notes:
- All API requests and responses use **JSON format**.
- The `username` is the primary identifier in Firebase.
- Symptoms should be logged with `name` and `severity` fields.
- AI-powered recommendations are generated dynamically based on symptoms.

---

### 📌 *For any issues or improvements, contact the development team.*

