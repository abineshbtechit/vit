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
    
    cursor.execute("SELECT id, name FROM users")
    users = cursor.fetchall()
        
    cursor.execute("SELECT * FROM patient_records ORDER BY created_at DESC LIMIT 10")
    records = cursor.fetchall()
    
    # Convert Decimals/datetimes to string for JSON serialization
    for r in records:
        for k, v in r.items():
            if hasattr(v, 'isoformat'):
                r[k] = v.isoformat()
            elif hasattr(v, 'to_eng_string'): # Decimal
                r[k] = str(v)
                
    print(json.dumps({"users": users, "records": records}, indent=2))
        
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
