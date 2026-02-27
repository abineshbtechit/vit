import mysql.connector
from mysql.connector import Error

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '0402'
}

def setup_database():
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        
        # Create Database
        cursor.execute("CREATE DATABASE IF NOT EXISTS mediflow_db")
        print("✓ Database 'mediflow_db' checked/created.")
        
        cursor.execute("USE mediflow_db")
        
        # 1. Create Tables with all required columns
        # Users Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(15) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        print("✓ Table 'users' checked/created.")

        # Hospitals Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS hospitals (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL
        )
        """)

        # Doctors Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS doctors (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          specialization VARCHAR(100) NOT NULL,
          hospital_id INT,
          FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
        )
        """)
        print("✓ Tables 'hospitals' and 'doctors' checked/created.")

        # Queries Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS queries (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          category VARCHAR(100) NOT NULL,
          message TEXT NOT NULL,
          user_id INT,
          hospital_id INT,
          doctor_id INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        print("✓ Table 'queries' checked/created.")

        # Appointments Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS appointments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          patient_name VARCHAR(255) NOT NULL,
          specialization VARCHAR(100) NOT NULL,
          appointment_date DATE NOT NULL,
          time_slot VARCHAR(50) NOT NULL,
          notes TEXT,
          user_id INT,
          hospital_id INT,
          doctor_id INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        print("✓ Table 'appointments' checked/created.")

        # Patient Records Table (Unified History)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS patient_records (
          id INT AUTO_INCREMENT PRIMARY KEY,
          patient_name VARCHAR(255) NOT NULL,
          doctor_name VARCHAR(255) NOT NULL,
          hospital_name VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          hospital_id INT NOT NULL,
          description TEXT NOT NULL,
          type VARCHAR(50) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        print("✓ Table 'patient_records' checked/created.")

        # 2. Migration: Add columns to existing tables if they were created earlier
        migration_statements = [
            "ALTER TABLE patient_records ADD COLUMN doctor_name VARCHAR(255)",
            "ALTER TABLE queries ADD COLUMN user_id INT",
            "ALTER TABLE queries ADD COLUMN hospital_id INT",
            "ALTER TABLE queries ADD COLUMN doctor_id INT",
            "ALTER TABLE appointments ADD COLUMN user_id INT",
            "ALTER TABLE appointments ADD COLUMN hospital_id INT",
            "ALTER TABLE appointments ADD COLUMN doctor_id INT"
        ]
        
        for statement in migration_statements:
            try:
                cursor.execute(statement)
                print(f"✓ Migration: {statement}")
            except Error as e:
                # Column might already exist, which is fine
                if e.errno == 1060: # Duplicate column name
                    pass
                else:
                    print(f"Migration Note (safe to ignore if column exists): {e}")

        # 3. Seed initial data
        cursor.execute("SELECT COUNT(*) FROM hospitals")
        if cursor.fetchone()[0] == 0:
            hospitals_data = [
                ("City Care Hospital", "Downtown"),
                ("Metro General", "Westside"),
                ("Apollo Speciality", "Central"),
                ("Main Square Clinic", "Eastside")
            ]
            cursor.executemany("INSERT INTO hospitals (name, location) VALUES (%s, %s)", hospitals_data)
            
            cursor.execute("SELECT id FROM hospitals")
            h_ids = [row[0] for row in cursor.fetchall()]
            
            doctors_data = [
                ("Dr. Smith", "Cardiology", h_ids[0]),
                ("Dr. Adams", "Dermatology", h_ids[1]),
                ("Dr. Brown", "Pediatrics", h_ids[2]),
                ("Dr. Wilson", "Neurology", h_ids[0]),
                ("Dr. Garcia", "General Health", h_ids[3])
            ]
            cursor.executemany("INSERT INTO doctors (name, specialization, hospital_id) VALUES (%s, %s, %s)", doctors_data)
            print("✓ Seeded sample hospitals and doctors data.")

        connection.commit()
        print("\nAll systems ready! Run 'python app.py' to start the backend.")

    except Error as e:
        print(f"Database Error: {e}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == '__main__':
    # Optional: USER requested to ensure the database is updated.
    # We will run the setup.
    setup_database()
