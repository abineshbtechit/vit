from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database Configuration
db_config = {
    "host": os.environ.get("DB_HOST"),
    "user": os.environ.get("DB_USER"),
    "password": os.environ.get("DB_PASSWORD"),
    "database": os.environ.get("DB_NAME"),
    "port": int(os.environ.get("DB_PORT", 3306))
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
    user_id = data.get('user_id')
    hospital_id = data.get('hospital_id')
    doctor_id = data.get('doctor_id')

    if not all([name, email, category, message]):
        return jsonify({"error": "Fields are required"}), 400

    connection = get_db_connection()
    if not connection: return jsonify({"error": "DB error"}), 500
        
    try:
        cursor = connection.cursor()
        # Original Insert
        query = "INSERT INTO queries (name, email, category, message, user_id, hospital_id, doctor_id) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        cursor.execute(query, (name, email, category, message, user_id, hospital_id, doctor_id))
        
        # Log to Unified Table
        cursor.execute("SELECT name, location FROM hospitals WHERE id = %s", (hospital_id,))
        hosp = cursor.fetchone()
        hosp_name = hosp[0] if hosp else "Unknown"
        hosp_loc = hosp[1] if hosp else "Unknown"
        
        cursor.execute("SELECT name FROM doctors WHERE id = %s", (doctor_id,))
        doc = cursor.fetchone()
        doc_name = doc[0] if doc else "Unknown"
        
        cursor.execute("""
            INSERT INTO patient_records (user_id, patient_name, doctor_name, hospital_name, location, hospital_id, description, type)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'Query')
        """, (user_id, name, doc_name, hosp_name, hosp_loc, hospital_id, message))
        
        connection.commit()
        return jsonify({"success": True, "id": cursor.lastrowid}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500
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
    user_id = data.get('user_id')
    hospital_id = data.get('hospital_id')
    doctor_id = data.get('doctor_id')
    payment_method = data.get('payment_method', 'hospital')
    payment_status = data.get('payment_status', 'Pending')
    fee = data.get('fee', 0)

    if not all([patient_name, specialization, appointment_date, time_slot]):
        return jsonify({"error": "Fields are required"}), 400

    connection = get_db_connection()
    if not connection: return jsonify({"error": "DB error"}), 500

    try:
        cursor = connection.cursor()
        # Original Insert
        query = "INSERT INTO appointments (patient_name, specialization, appointment_date, time_slot, notes, user_id, hospital_id, doctor_id, payment_method, payment_status, fee) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        cursor.execute(query, (patient_name, specialization, appointment_date, time_slot, notes, user_id, hospital_id, doctor_id, payment_method, payment_status, fee))
        
        # Log to Unified Table
        cursor.execute("SELECT name, location FROM hospitals WHERE id = %s", (hospital_id,))
        hosp = cursor.fetchone()
        hosp_name = hosp[0] if hosp else "Unknown"
        hosp_loc = hosp[1] if hosp else "Unknown"
        
        cursor.execute("SELECT name FROM doctors WHERE id = %s", (doctor_id,))
        doc = cursor.fetchone()
        doc_name = doc[0] if doc else "Unknown"
        
        cursor.execute("""
            INSERT INTO patient_records (user_id, patient_name, doctor_name, hospital_name, location, hospital_id, description, type, payment_method, payment_status, fee)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'Appointment', %s, %s, %s)
        """, (user_id, patient_name, doc_name, hosp_name, hosp_loc, hospital_id, notes or "No notes", payment_method, payment_status, fee))
        
        connection.commit()
        return jsonify({"success": True, "id": cursor.lastrowid}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# 5. Hospitals and Doctors Endpoints
@app.route('/api/hospitals', methods=['GET'])
def get_hospitals():
    connection = get_db_connection()
    if not connection: return jsonify({"error": "DB error"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM hospitals")
        return jsonify(cursor.fetchall()), 200
    finally:
        cursor.close()
        connection.close()

@app.route('/api/hospitals/<int:hospital_id>/doctors', methods=['GET'])
def get_doctors(hospital_id):
    connection = get_db_connection()
    if not connection: return jsonify({"error": "DB error"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM doctors WHERE hospital_id = %s", (hospital_id,))
        return jsonify(cursor.fetchall()), 200
    finally:
        cursor.close()
        connection.close()

# 3. User Signup Endpoint
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    phone = data.get('phone')
    password = data.get('password')

    if not all([name, phone, password]):
        return jsonify({"error": "Name, Phone, and Password are required"}), 400

    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id FROM users WHERE phone = %s", (phone,))
        if cursor.fetchone():
            return jsonify({"error": "User with this phone number already exists"}), 409

        query = "INSERT INTO users (name, phone, password) VALUES (%s, %s, %s)"
        cursor.execute(query, (name, phone, password))
        user_id = cursor.lastrowid
        connection.commit()
        return jsonify({"success": True, "message": "Signup successful", "user": {"id": user_id, "name": name, "phone": phone}}), 201
    except Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        cursor.close()
        connection.close()

# 4. User Login Endpoint
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    phone = data.get('phone')
    password = data.get('password')

    if not all([phone, password]):
        return jsonify({"error": "Phone and Password are required"}), 400

    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        query = "SELECT id, name, phone FROM users WHERE phone = %s AND password = %s"
        cursor.execute(query, (phone, password))
        user = cursor.fetchone()

        if user:
            return jsonify({"success": True, "message": "Login successful", "user": user}), 200
        else:
            return jsonify({"error": "Invalid phone number or password"}), 401
    except Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/user/<int:user_id>/activity', methods=['GET'])
def get_user_activity(user_id):
    connection = get_db_connection()
    if not connection: return jsonify({"error": "DB error"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        # Fetch name of the user as fallback for legacy records
        cursor.execute("SELECT name FROM users WHERE id = %s", (user_id,))
        user_info = cursor.fetchone()
        
        # Query by user_id primary, or name as fallback (OR condition)
        query = """
            SELECT id, type, created_at as date, doctor_name, hospital_name, 
                   location, hospital_id, description, patient_name, payment_status, fee, is_read
            FROM patient_records
            WHERE user_id = %s
        """
        params = [user_id]
        
        if user_info:
            query += " OR (user_id IS NULL AND patient_name = %s)"
            params.append(user_info['name'])
            
        query += " ORDER BY created_at DESC"
        
        cursor.execute(query, tuple(params))
        return jsonify(cursor.fetchall()), 200
    finally:
        cursor.close()
        connection.close()

@app.route('/api/records/<int:record_id>/read', methods=['PUT'])
def mark_record_read(record_id):
    connection = get_db_connection()
    if not connection: return jsonify({"error": "DB error"}), 500
    try:
        cursor = connection.cursor()
        cursor.execute("UPDATE patient_records SET is_read = TRUE WHERE id = %s", (record_id,))
        connection.commit()
        return jsonify({"success": True}), 200
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/records/<int:record_id>', methods=['GET'])
def get_record(record_id):
    connection = get_db_connection()
    if not connection: return jsonify({"error": "DB error"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM patient_records WHERE id = %s", (record_id,))
        record = cursor.fetchone()
        if not record: return jsonify({"error": "Record not found"}), 404
        return jsonify(record), 200
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


