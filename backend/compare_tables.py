import mysql.connector
import json

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '0402',
    'database': 'mediflow_db'
}

try:
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM queries")
    queries = cursor.fetchall()
    
    cursor.execute("SELECT * FROM patient_records")
    records = cursor.fetchall()
    
    print(f"Total Queries: {len(queries)}")
    print(f"Total Patient Records: {len(records)}")
    
    if queries:
        print("\n--- Last Query ---")
        print(queries[-1])
        
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
