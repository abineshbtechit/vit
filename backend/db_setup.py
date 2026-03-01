import os
import mysql.connector
from mysql.connector import Error as MySQLError

# Make postgres optional for local dev
try:
    import psycopg2
    from urllib.parse import urlparse
    HAS_POSTGRES = True
except ImportError:
    HAS_POSTGRES = False

DATABASE_URL = os.getenv('DATABASE_URL')
db_config_mysql = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', '0402')
}

def setup_database():
    is_postgres = False
    connection = None
    
    try:
        if DATABASE_URL and HAS_POSTGRES:
            print("Connecting to PostgreSQL...")
            connection = psycopg2.connect(DATABASE_URL)
            is_postgres = True
        elif DATABASE_URL and not HAS_POSTGRES:
            print("Note: DATABASE_URL is set but 'psycopg2' is not installed. Using MySQL instead.")
            print("Connecting to MySQL...")
            connection = mysql.connector.connect(**db_config_mysql)
            is_postgres = False
        else:
            print("Connecting to MySQL...")
            connection = mysql.connector.connect(**db_config_mysql)
            is_postgres = False
            
        cursor = connection.cursor()
        
        if not is_postgres:
            cursor.execute("CREATE DATABASE IF NOT EXISTS mediflow_db")
            cursor.execute("USE mediflow_db")
            print("✓ MySQL Database 'mediflow_db' ready.")
        else:
            print("✓ PostgreSQL Database ready.")

        # SQL Dialect helpers
        ID_TYPE = "SERIAL PRIMARY KEY" if is_postgres else "INT AUTO_INCREMENT PRIMARY KEY"
        TEXT_TYPE = "TEXT"
        TIMESTAMP_TYPE = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"

        # 1. Create Tables
        # Users Table
        cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS users (
          id {ID_TYPE},
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(15) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at {TIMESTAMP_TYPE}
        )
        """)
        
        # Hospitals Table
        cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS hospitals (
          id {ID_TYPE},
          name VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL
        )
        """)

        # Doctors Table
        cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS doctors (
          id {ID_TYPE},
          name VARCHAR(255) NOT NULL,
          specialization VARCHAR(100) NOT NULL,
          hospital_id INT,
          FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
        )
        """)

        # Queries Table
        cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS queries (
          id {ID_TYPE},
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          category VARCHAR(100) NOT NULL,
          message {TEXT_TYPE} NOT NULL,
          user_id INT,
          hospital_id INT,
          doctor_id INT,
          created_at {TIMESTAMP_TYPE}
        )
        """)

        # Appointments Table
        cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS appointments (
          id {ID_TYPE},
          patient_name VARCHAR(255) NOT NULL,
          specialization VARCHAR(100) NOT NULL,
          appointment_date DATE NOT NULL,
          time_slot VARCHAR(50) NOT NULL,
          notes {TEXT_TYPE},
          user_id INT,
          hospital_id INT,
          doctor_id INT,
          payment_method VARCHAR(50),
          payment_status VARCHAR(50),
          fee DECIMAL(10, 2),
          created_at {TIMESTAMP_TYPE}
        )
        """)

        # Patient Records Table
        cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS patient_records (
          id {ID_TYPE},
          user_id INT,
          patient_name VARCHAR(255) NOT NULL,
          doctor_name VARCHAR(255) NOT NULL,
          hospital_name VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          hospital_id INT NOT NULL,
          description {TEXT_TYPE} NOT NULL,
          type VARCHAR(50) NOT NULL,
          payment_method VARCHAR(50),
          payment_status VARCHAR(50),
          fee DECIMAL(10, 2),
          is_read BOOLEAN DEFAULT FALSE,
          created_at {TIMESTAMP_TYPE}
        )
        """)
        print("✓ All tables checked/created.")

        # Seed data if empty
        cursor.execute("SELECT COUNT(*) FROM hospitals")
        if cursor.fetchone()[0] == 0:
            hospitals_data = [
                ("City Care Hospital", "Downtown"),
                ("Metro General", "Westside"),
                ("Apollo Speciality", "Central"),
                ("Main Square Clinic", "Eastside"),
                ("St. Mary's Medical Center", "North Valley"),
                ("Oakwood General Hospital", "South Shore"),
                ("Green Valley Clinic", "Green Valley"),
                ("Sunrise Children's Hospital", "Eastside"),
                ("Pacific Heart Institute", "Harbor District"),
                ("North Star Orthopedics", "North Valley"),
                ("Lakeside Wellness Center", "South Shore"),
                ("Royal Park Hospital", "Central")
            ]
            cursor.executemany("INSERT INTO hospitals (name, location) VALUES (%s, %s)", hospitals_data)
            
            cursor.execute("SELECT id FROM hospitals")
            h_ids = [row[0] for row in cursor.fetchall()]
            
            doctors_data = [
                ("Dr. Smith", "Cardiology", h_ids[0]),
                ("Dr. Wilson", "Neurology", h_ids[0]),
                ("Dr. Miller", "General Surgery", h_ids[0]),
                ("Dr. Adams", "Dermatology", h_ids[1]),
                ("Dr. Taylor", "Orthopedics", h_ids[1]),
                ("Dr. Anderson", "ENT", h_ids[1]),
                ("Dr. Brown", "Pediatrics", h_ids[2]),
                ("Dr. Thomas", "Internal Medicine", h_ids[2]),
                ("Dr. Garcia", "General Health", h_ids[3]),
                ("Dr. Rodriguez", "Gastroenterology", h_ids[3]),
                ("Dr. Martinez", "Psychiatry", h_ids[4]),
                ("Dr. Hernandez", "Oncology", h_ids[4]),
                ("Dr. Lopez", "Urology", h_ids[5]),
                ("Dr. Gonzalez", "Ophthalmology", h_ids[5]),
                ("Dr. Perez", "Gynecology", h_ids[6]),
                ("Dr. Clark", "Pediatrics", h_ids[7]),
                ("Dr. Lewis", "Child Psychology", h_ids[7]),
                ("Dr. Walker", "Cardiology", h_ids[8]),
                ("Dr. Young", "Cardiovascular Surgery", h_ids[8]),
                ("Dr. Hall", "Orthopedics", h_ids[9]),
                ("Dr. Allen", "Sports Medicine", h_ids[9]),
                ("Dr. Wright", "Physiotherapy", h_ids[10]),
                ("Dr. King", "Endocrinology", h_ids[11]),
                ("Dr. Scott", "Rheumatology", h_ids[11])
            ]
            cursor.executemany("INSERT INTO doctors (name, specialization, hospital_id) VALUES (%s, %s, %s)", doctors_data)
            print("✓ Seeded sample hospitals and doctors data.")

        connection.commit()
        print("\nDatabase setup complete!")

    except Exception as e:
        print(f"Database Error: {e}")
    finally:
        if connection:
            cursor.close()
            connection.close()

if __name__ == '__main__':
    setup_database()

if __name__ == '__main__':
    # Optional: USER requested to ensure the database is updated.
    # We will run the setup.
    setup_database()
