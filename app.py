import os
from urllib.parse import urlparse
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error

# Make postgres driver optional for local dev
try:
    import psycopg2
    import psycopg2.extras
    HAS_POSTGRES = True
except ImportError:
    HAS_POSTGRES = False

app = Flask(__name__)
CORS(app)

# Database Configuration (Postgres is prioritized for production)
DATABASE_URL = os.getenv('DATABASE_URL')
MYSQL_HOST = os.getenv('DB_HOST', 'localhost')
MYSQL_USER = os.getenv('DB_USER', 'root')
MYSQL_PASS = os.getenv('DB_PASSWORD', '0402')
MYSQL_NAME = os.getenv('DB_NAME', 'mediflow_db')
MYSQL_PORT = int(os.getenv('DB_PORT', 3306))

def get_db_connection():
    # 1. Try PostgreSQL (Priority for Render)
    if DATABASE_URL and HAS_POSTGRES:
        try:
            conn = psycopg2.connect(DATABASE_URL)
            return conn, True
        except Exception as e:
            print(f"Postgres error: {e}")
    elif DATABASE_URL and not HAS_POSTGRES:
        print("DATABASE_URL is set but 'psycopg2' is not installed. Falling back to MySQL.")

    # 2. Fallback to MySQL (For Local Dev)
    try:
        conn = mysql.connector.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASS,
            database=MYSQL_NAME,
            port=MYSQL_PORT
        )
        return conn, False
    except Error as e:
        print(f"MySQL error: {e}")
        return None, False

def get_cursor(conn, is_postgres, dictionary=True):
    if is_postgres:
        if dictionary:
            return conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        return conn.cursor()
    else:
        if dictionary:
            return conn.cursor(dictionary=True)
        return conn.cursor()

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

    connection, is_postgres = get_db_connection()
    if not connection: return jsonify({"error": "DB error"}), 500
        
    try:
        cursor = get_cursor(connection, is_postgres, dictionary=False)
        # Original Insert
        last_id = None
        query = "INSERT INTO queries (name, email, category, message, user_id, hospital_id, doctor_id) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        if is_postgres:
            query += " RETURNING id"
            cursor.execute(query, (name, email, category, message, user_id, hospital_id, doctor_id))
            last_id = cursor.fetchone()[0]
        else:
            cursor.execute(query, (name, email, category, message, user_id, hospital_id, doctor_id))
            last_id = cursor.lastrowid
        
        # Log to Unified Table
        cursor.execute("SELECT name, location FROM hospitals WHERE id = %s", (hospital_id,))
        hosp = cursor.fetchone()
        hosp_name = hosp[0] if hosp else "Unknown"
        hosp_loc = hosp[1] if hosp else "Unknown"
        
        cursor.execute("SELECT name FROM doctors WHERE id = %s", (doctor_id,))
        doc = cursor.fetchone()
        doc_name = doc[0] if doc else "Unknown"
        
        insert_rec = """
            INSERT INTO patient_records (user_id, patient_name, doctor_name, hospital_name, location, hospital_id, description, type)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'Query')
        """
        cursor.execute(insert_rec, (user_id, name, doc_name, hosp_name, hosp_loc, hospital_id, message))
        
        connection.commit()
        return jsonify({"success": True, "id": last_id}), 201
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

    connection, is_postgres = get_db_connection()
    if not connection: return jsonify({"error": "DB error"}), 500

    try:
        cursor = get_cursor(connection, is_postgres, dictionary=False)
        # Original Insert
        last_id = None
        query = "INSERT INTO appointments (patient_name, specialization, appointment_date, time_slot, notes, user_id, hospital_id, doctor_id, payment_method, payment_status, fee) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        if is_postgres:
            query += " RETURNING id"
            cursor.execute(query, (patient_name, specialization, appointment_date, time_slot, notes, user_id, hospital_id, doctor_id, payment_method, payment_status, fee))
            last_id = cursor.fetchone()[0]
        else:
            cursor.execute(query, (patient_name, specialization, appointment_date, time_slot, notes, user_id, hospital_id, doctor_id, payment_method, payment_status, fee))
            last_id = cursor.lastrowid
        
        # Log to Unified Table
        cursor.execute("SELECT name, location FROM hospitals WHERE id = %s", (hospital_id,))
        hosp = cursor.fetchone()
        hosp_name = hosp[0] if hosp else "Unknown"
        hosp_loc = hosp[1] if hosp else "Unknown"
        
        cursor.execute("SELECT name FROM doctors WHERE id = %s", (doctor_id,))
        doc = cursor.fetchone()
        doc_name = doc[0] if doc else "Unknown"
        
        insert_rec = """
            INSERT INTO patient_records (user_id, patient_name, doctor_name, hospital_name, location, hospital_id, description, type, payment_method, payment_status, fee)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'Appointment', %s, %s, %s)
        """
        cursor.execute(insert_rec, (user_id, patient_name, doc_name, hosp_name, hosp_loc, hospital_id, notes or "No notes", payment_method, payment_status, fee))
        
        connection.commit()
        return jsonify({"success": True, "id": last_id}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# 5. Hospitals and Doctors Endpoints
@app.route('/api/hospitals', methods=['GET'])
def get_hospitals():
    connection, is_postgres = get_db_connection()
    if not connection: return jsonify({"error": "DB error"}), 500
    try:
        cursor = get_cursor(connection, is_postgres, dictionary=True)
        cursor.execute("SELECT * FROM hospitals")
        hospitals = cursor.fetchall()
        return jsonify(hospitals), 200
    finally:
        cursor.close()
        connection.close()

@app.route('/api/hospitals/<int:hospital_id>/doctors', methods=['GET'])
def get_doctors(hospital_id):
    connection, is_postgres = get_db_connection()
    if not connection: return jsonify({"error": "DB error"}), 500
    try:
        cursor = get_cursor(connection, is_postgres, dictionary=True)
        cursor.execute("SELECT * FROM doctors WHERE hospital_id = %s", (hospital_id,))
        doctors = cursor.fetchall()
        return jsonify(doctors), 200
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

    connection, is_postgres = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = get_cursor(connection, is_postgres, dictionary=True)
        cursor.execute("SELECT id FROM users WHERE phone = %s", (phone,))
        if cursor.fetchone():
            return jsonify({"error": "User with this phone number already exists"}), 409

        query = "INSERT INTO users (name, phone, password) VALUES (%s, %s, %s)"
        if is_postgres:
            query += " RETURNING id"
            cursor.execute(query, (name, phone, password))
            user_id = cursor.fetchone()['id'] if isinstance(cursor.fetchone(), dict) else cursor.fetchone()[0]
        else:
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

    connection, is_postgres = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = get_cursor(connection, is_postgres, dictionary=True)
        query = "SELECT id, name, phone FROM users WHERE phone = %s AND password = %s"
        cursor.execute(query, (phone, password))
        user = cursor.fetchone()

        if user:
            return jsonify({"success": True, "message": "Login successful", "user": dict(user)}), 200
        else:
            return jsonify({"error": "Invalid phone number or password"}), 401
    finally:
        cursor.close()
        connection.close()

@app.route('/api/user/<int:user_id>/activity', methods=['GET'])
def get_user_activity(user_id):
    connection, is_postgres = get_db_connection()
    if not connection: return jsonify({"error": "DB error"}), 500
    try:
        cursor = get_cursor(connection, is_postgres, dictionary=True)
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
        results = cursor.fetchall()
        return jsonify([dict(r) for r in results]), 200
    finally:
        cursor.close()
        connection.close()

@app.route('/api/records/<int:record_id>/read', methods=['PUT'])
def mark_record_read(record_id):
    connection, is_postgres = get_db_connection()
    if not connection: return jsonify({"error": "DB error"}), 500
    try:
        cursor = connection.cursor()
        cursor.execute("UPDATE patient_records SET is_read = TRUE WHERE id = %s", (record_id,))
        connection.commit()
        return jsonify({"success": True}), 200
    finally:
        cursor.close()
        connection.close()

@app.route('/api/records/<int:record_id>', methods=['GET'])
def get_record(record_id):
    connection, is_postgres = get_db_connection()
    if not connection: return jsonify({"error": "DB error"}), 500
    try:
        cursor = get_cursor(connection, is_postgres, dictionary=True)
        cursor.execute("SELECT * FROM patient_records WHERE id = %s", (record_id,))
        record = cursor.fetchone()
        if not record: return jsonify({"error": "Record not found"}), 404
        return jsonify(dict(record)), 200
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
