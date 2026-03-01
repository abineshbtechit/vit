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
    
    print("--- Users ---")
    cursor.execute("SELECT id, name FROM users")
    for row in cursor.fetchall():
        print(row)
        
    print("\n--- Patient Records (Last 5) ---")
    cursor.execute("SELECT * FROM patient_records ORDER BY created_at DESC LIMIT 5")
    rows = cursor.fetchall()
    if rows:
        columns = rows[0].keys()
        print(" | ".join(columns))
        print("-" * 50)
        for row in rows:
            print(" | ".join(str(row[col]) for col in columns))
    else:
        print("No records found.")
        
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
