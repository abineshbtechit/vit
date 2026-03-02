import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg
from psycopg.rows import dict_row
import mysql.connector

app = Flask(__name__)

# ✅ Allow both deployed and local frontend
CORS(app, origins=["https://vit-chi.vercel.app", "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"])

# ✅ DB Configuration
DATABASE_URL = os.getenv("DATABASE_URL")
DB_CONFIG_MYSQL = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', '0402'),
    'database': os.getenv('DB_NAME', 'mediflow_db')
}

def get_db_connection():
    # Use PostgreSQL if DATABASE_URL is set (Render/Production)
    if DATABASE_URL:
        try:
            conn = psycopg.connect(DATABASE_URL, row_factory=dict_row)
            return conn, True  # True = is_postgres
        except Exception as e:
            print("Postgres connection error:", e)
            return None, True
    
    # Fallback to MySQL (Local)
    try:
        conn = mysql.connector.connect(**DB_CONFIG_MYSQL)
        return conn, False  # False = is_postgres
    except Exception as e:
        print("MySQL connection error:", e)
        return None, False

def get_cursor(conn, is_postgres, dictionary=True):
    if is_postgres:
        return conn.cursor()          # Postgres already dict_row
    else:
        return conn.cursor(dictionary=True)  # MySQL needs this
# ---------------- AUTH ----------------
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    name = data.get("name")
    phone = data.get("phone")
    password = data.get("password")

    if not all([name, phone, password]):
        return jsonify({"error": "Missing required fields"}), 400

    conn, is_pg = get_db_connection()
    if not conn:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        cur = get_cursor(conn, is_pg, dictionary=False)
        
        # Check if user already exists
        cur.execute("SELECT id FROM users WHERE phone = %s", (phone,))
        if cur.fetchone():
            return jsonify({"error": "User with this phone number already exists"}), 400

        # Insert new user
        placeholder = "%s"
        returning = "RETURNING id" if is_pg else ""
        cur.execute(f"""
            INSERT INTO users (name, phone, password)
            VALUES ({placeholder}, {placeholder}, {placeholder})
            {returning}
        """, (name, phone, password))
        
        user_id = cur.fetchone()[0] if is_pg else cur.lastrowid
        conn.commit()

        return jsonify({
            "success": True,
            "user": {"id": user_id, "name": name, "phone": phone}
        }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    phone = data.get("phone")
    password = data.get("password")

    if not all([phone, password]):
        return jsonify({"error": "Missing phone or password"}), 400

    conn, is_pg = get_db_connection()
    if not conn:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        cur = get_cursor(conn, is_pg)
        cur.execute("SELECT * FROM users WHERE phone = %s AND password = %s", (phone, password))
        user = cur.fetchone()

        if user:
            # Handle both MySQL (dict) and Postgres (dict_row)
            user_data = dict(user)
            user_data.pop('password', None) # Don't send password back
            return jsonify({"success": True, "user": user_data}), 200
        else:
            return jsonify({"error": "Invalid phone number or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# ---------------- HEALTH ----------------
@app.route("/health")
def health():
    return jsonify({"status": "ok"}), 200

# ---------------- QUERIES ----------------
@app.route("/api/queries", methods=["POST"])
def submit_query():
    data = request.json
    required = ["name", "email", "category", "message"]
    if not all(data.get(k) for k in required):
        return jsonify({"error": "Missing fields"}), 400

    conn, is_pg = get_db_connection()
    if not conn:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        cur = get_cursor(conn, is_pg, dictionary=False)
        
        # 1. Insert into queries table
        placeholder = "%s"
        returning = "RETURNING id" if is_pg else ""
        
        cur.execute(f"""
            INSERT INTO queries (name, email, category, message, user_id, hospital_id, doctor_id)
            VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder})
            {returning}
        """, (
            data["name"], data["email"], data["category"], data["message"],
            data.get("user_id"), data.get("hospital_id"), data.get("doctor_id")
        ))
        
        query_id = cur.fetchone()[0] if is_pg else cur.lastrowid

        # 2. Log to patient_records if user_id is present
        if data.get("user_id"):
            # Fetch hospital/doctor names for the record
            h_name, d_name, loc = "N/A", "General Inquiry", "N/A"
            if data.get("hospital_id"):
                cur.execute("SELECT name, location FROM hospitals WHERE id = %s", (data["hospital_id"],))
                h_row = cur.fetchone()
                if h_row: h_name, loc = h_row[0], h_row[1]
            
            cur.execute(f"""
                INSERT INTO patient_records 
                (user_id, patient_name, doctor_name, hospital_name, location, hospital_id, description, type, created_at)
                VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, CURRENT_TIMESTAMP)
            """, (
                data["user_id"], data["name"], d_name, h_name, loc, data.get("hospital_id", 0),
                f"Query: {data['category']} - {data['message'][:50]}...", "Query"
            ))
            
        conn.commit()
        return jsonify({"success": True, "id": query_id}), 201

    except Exception as e:
        conn.rollback()
        print("Query error:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# ---------------- APPOINTMENTS ----------------
@app.route("/api/appointments", methods=["POST"])
def appointments():
    data = request.json
    required = ["patient_name", "specialization", "appointment_date", "time_slot"]
    if not all(data.get(k) for k in required):
        return jsonify({"error": "Missing fields"}), 400

    conn, is_pg = get_db_connection()
    if not conn:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        cur = get_cursor(conn, is_pg, dictionary=False)
        
        placeholder = "%s"
        returning = "RETURNING id" if is_pg else ""
        
        cur.execute(f"""
            INSERT INTO appointments
            (patient_name, specialization, appointment_date, time_slot, notes,
             user_id, hospital_id, doctor_id, payment_method, payment_status, fee)
            VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, 
                    {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder})
            {returning}
        """, (
            data["patient_name"], data["specialization"], data["appointment_date"],
            data["time_slot"], data.get("notes"), data.get("user_id"),
            data.get("hospital_id"), data.get("doctor_id"),
            data.get("payment_method", "hospital"), data.get("payment_status", "Pending"),
            data.get("fee", 0)
        ))
        
        appointment_id = cur.fetchone()[0] if is_pg else cur.lastrowid
        
        # 2. Log to patient_records
        if data.get("user_id"):
            h_name, d_name, loc = "N/A", data["specialization"], "N/A"
            if data.get("hospital_id"):
                cur.execute("SELECT name, location FROM hospitals WHERE id = %s", (data["hospital_id"],))
                h_row = cur.fetchone()
                if h_row: h_name, loc = h_row[0], h_row[1]
            
            if data.get("doctor_id"):
                cur.execute("SELECT name FROM doctors WHERE id = %s", (data["doctor_id"],))
                d_row = cur.fetchone()
                if d_row: d_name = d_row[0]

            cur.execute(f"""
                INSERT INTO patient_records 
                (user_id, patient_name, doctor_name, hospital_name, location, hospital_id, 
                 description, type, payment_method, payment_status, fee, created_at)
                VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, 
                        {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, CURRENT_TIMESTAMP)
            """, (
                data["user_id"], data["patient_name"], d_name, h_name, loc, data.get("hospital_id", 0),
                f"Appointment for {data['specialization']} on {data['appointment_date']}", "Appointment",
                data.get("payment_method", "hospital"), data.get("payment_status", "Pending"), data.get("fee", 0)
            ))

        conn.commit()
        return jsonify({"success": True, "id": appointment_id}), 201

    except Exception as e:
        conn.rollback()
        print("Appointment error:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()


# ---------------- HOSPITALS ----------------
@app.route("/api/hospitals", methods=["GET"])
def hospitals():
    conn, is_pg = get_db_connection()
    if not conn:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        cur = get_cursor(conn, is_pg)
        cur.execute("SELECT * FROM hospitals")
        return jsonify(cur.fetchall()), 200
    finally:
        cur.close()
        conn.close()

@app.route("/api/hospitals/<int:hospital_id>/doctors", methods=["GET"])
def doctors(hospital_id):
    conn, is_pg = get_db_connection()
    if not conn:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        cur = get_cursor(conn, is_pg)
        cur.execute("SELECT * FROM doctors WHERE hospital_id = %s", (hospital_id,))
        return jsonify(cur.fetchall()), 200
    finally:
        cur.close()
        conn.close()

# ---------------- ACTIVITY / RECORDS ----------------
@app.route("/api/user/<int:user_id>/activity", methods=["GET"])
def get_user_activity(user_id):
    conn, is_pg = get_db_connection()
    if not conn:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        cur = get_cursor(conn, is_pg)
        # We fetch records from the patient_records table which logs all activities
        cur.execute("SELECT * FROM patient_records WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
        records = cur.fetchall()
        return jsonify(records), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# ---------------- ROOT ----------------
@app.route("/")
def index():
    return jsonify({
        "message": "MediFlow API running",
        "frontend": "https://vit-chi.vercel.app",
        "local_frontend": "http://localhost:5173"
    }), 200

# ---------------- MAIN ----------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
