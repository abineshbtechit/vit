import mysql.connector
from mysql.connector import Error

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '0402'  # Using the password you provided
}

def setup_database():
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        
        # Create Database
        cursor.execute("CREATE DATABASE IF NOT EXISTS mediflow_db")
        print("✓ Database 'mediflow_db' checked/created.")
        
        cursor.execute("USE mediflow_db")
        
        # Create Tables
        queries_table = """
        CREATE TABLE IF NOT EXISTS queries (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          category VARCHAR(100) NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        cursor.execute(queries_table)
        print("✓ Table 'queries' checked/created.")
        
        appointments_table = """
        CREATE TABLE IF NOT EXISTS appointments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          patient_name VARCHAR(255) NOT NULL,
          specialization VARCHAR(100) NOT NULL,
          appointment_date DATE NOT NULL,
          time_slot VARCHAR(50) NOT NULL,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        cursor.execute(appointments_table)
        print("✓ Table 'appointments' checked/created.")
        
        print("\nAll systems ready! You can now run 'python app.py'")
        
    except Error as e:
        print(f"Error: {e}")
        print("\nPlease make sure:")
        print("1. MySQL Server is running.")
        print("2. Your username (root) and password (0402) are correct.")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == '__main__':
    setup_database()
