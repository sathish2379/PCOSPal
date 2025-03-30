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
POST /submit_symptoms
```
### **Description:**
Allows users to log their symptoms, including severity levels.
### **Request Body:**
```json
{
  "username": "sat2379",
  "symptoms": [
    {"name": "acne", "severity": "Moderate"},
    {"name": "mood swings", "severity": "Mild"}
  ]
}
```
### **Response:**
#### **Success (201)**
```json
{
  "message": "Symptoms logged successfully",
  "recommendations": ["Drink more water", "Exercise regularly"],
  "doctor_advice": "Consider consulting a doctor if symptoms persist"
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

## Notes:
- All API requests and responses use **JSON format**.
- The `username` is the primary identifier in Firebase.
- Symptoms should be logged with `name` and `severity` fields.
- AI-powered recommendations are generated dynamically based on symptoms.
---
