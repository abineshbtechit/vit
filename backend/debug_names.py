import mysql.connector

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '0402',
    'database': 'mediflow_db'
}

try:
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT id, name FROM users")
    users = cursor.fetchall()
    print("Users:", users)
    
    cursor.execute("SELECT id, user_id, patient_name, type FROM patient_records")
    records = cursor.fetchall()
    print("\nPatient Records (Sample):")
    for r in records[:10]:
        print(r)
        
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
