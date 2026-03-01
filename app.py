import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import psycopg2.extras

app = Flask(__name__)

# ✅ Allow ONLY your deployed frontend
CORS(app, origins=["https://vit-chi.vercel.app"])

# ✅ PostgreSQL (Render)
DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print("Postgres connection error:", e)
        return None

def get_cursor(conn, dictionary=True):
    if dictionary:
        return conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    return conn.cursor()

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

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "DB error"}), 500

    try:
        cur = get_cursor(conn, dictionary=False)

        cur.execute("""
            INSERT INTO queries (name, email, category, message, user_id, hospital_id, doctor_id)
            VALUES (%s,%s,%s,%s,%s,%s,%s)
            RETURNING id
        """, (
            data["name"],
            data["email"],
            data["category"],
            data["message"],
            data.get("user_id"),
            data.get("hospital_id"),
            data.get("doctor_id")
        ))

        query_id = cur.fetchone()[0]
        conn.commit()
        return jsonify({"success": True, "id": query_id}), 201

    except Exception as e:
        conn.rollback()
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

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "DB error"}), 500

    try:
        cur = get_cursor(conn, dictionary=False)

        cur.execute("""
            INSERT INTO appointments
            (patient_name, specialization, appointment_date, time_slot, notes,
             user_id, hospital_id, doctor_id, payment_method, payment_status, fee)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING id
        """, (
            data["patient_name"],
            data["specialization"],
            data["appointment_date"],
            data["time_slot"],
            data.get("notes"),
            data.get("user_id"),
            data.get("hospital_id"),
            data.get("doctor_id"),
            data.get("payment_method", "hospital"),
            data.get("payment_status", "Pending"),
            data.get("fee", 0)
        ))

        appointment_id = cur.fetchone()[0]
        conn.commit()
        return jsonify({"success": True, "id": appointment_id}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# ---------------- HOSPITALS ----------------
@app.route("/api/hospitals", methods=["GET"])
def hospitals():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "DB error"}), 500

    try:
        cur = get_cursor(conn)
        cur.execute("SELECT * FROM hospitals")
        return jsonify(cur.fetchall()), 200
    finally:
        cur.close()
        conn.close()

@app.route("/api/hospitals/<int:hospital_id>/doctors", methods=["GET"])
def doctors(hospital_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "DB error"}), 500

    try:
        cur = get_cursor(conn)
        cur.execute("SELECT * FROM doctors WHERE hospital_id = %s", (hospital_id,))
        return jsonify(cur.fetchall()), 200
    finally:
        cur.close()
        conn.close()

# ---------------- ROOT ----------------
@app.route("/")
def index():
    return jsonify({
        "message": "MediFlow API running",
        "frontend": "https://vit-chi.vercel.app"
    }), 200

# ---------------- MAIN ----------------
if __name__ == "__main__":
    app.run(port=5000, debug=True)