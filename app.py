from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database Configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '0402',  # Updated by user
    'database': 'mediflow_db'
}

def get_db_connection():
    try:
        connection = mysql.connector.connect(**db_config)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# 1. Patient Healthcare Queries Endpoint
@app.route('/api/queries', methods=['POST'])
def submit_query():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    category = data.get('category')
    message = data.get('message')

    # Basic Validation
    if not all([name, email, category, message]):
        return jsonify({"error": "All fields are required"}), 400

    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Failed to connect to the database. Make sure MySQL is running and the 'mediflow_db' database exists."}), 500
        
    try:
        cursor = connection.cursor()
        query = "INSERT INTO queries (name, email, category, message) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (name, email, category, message))
        connection.commit()
        return jsonify({"success": True, "message": "Query submitted successfully", "id": cursor.lastrowid}), 201
    except Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        cursor.close()
        connection.close()

# 2. Doctor Appointment Requests Endpoint
@app.route('/api/appointments', methods=['POST'])
def request_appointment():
    data = request.json
    patient_name = data.get('patient_name')
    specialization = data.get('specialization')
    appointment_date = data.get('appointment_date')
    time_slot = data.get('time_slot')
    notes = data.get('notes', '')

    # Basic Validation
    if not all([patient_name, specialization, appointment_date, time_slot]):
        return jsonify({"error": "All mandatory fields are required"}), 400

    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Failed to connect to the database. Make sure MySQL is running and the 'mediflow_db' database exists."}), 500

    try:
        cursor = connection.cursor()
        query = "INSERT INTO appointments (patient_name, specialization, appointment_date, time_slot, notes) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(query, (patient_name, specialization, appointment_date, time_slot, notes))
        connection.commit()
        return jsonify({"success": True, "message": "Appointment request submitted successfully", "id": cursor.lastrowid}), 201
    except Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "message": "MediFlow API is running successfully",
        "endpoints": {
            "health": "/health",
            "queries": "/api/queries",
            "appointments": "/api/appointments"
        },
        "note": "To view the frontend, please run 'npm run dev' in a separate terminal and visit the Vite URL (usually http://localhost:5173)."
    }), 200

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Server is running"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
