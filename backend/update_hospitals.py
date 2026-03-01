import mysql.connector

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '0402',
    'database': 'mediflow_db'
}

connection = mysql.connector.connect(**db_config)
cursor = connection.cursor()

# Add description column if it doesn't exist
try:
    cursor.execute("ALTER TABLE hospitals ADD COLUMN description TEXT")
    print("✓ Added 'description' column to hospitals.")
except Exception as e:
    print(f"Note: {e}")

# Update first 5 hospitals with real data
hospitals = [
    ("Prashanth Superspecialty Hospital", "Chennai, Tamil Nadu", "Known for its excellent customer service and modern facilities. Offers world-class treatments across multiple specialties with state-of-the-art infrastructure."),
    ("Apollo Spectra Hospitals", "Chennai, Tamil Nadu", "Offers a range of medical specialties with high-quality care. A trusted name in day-care surgeries and advanced minimally invasive procedures."),
    ("Rela Hospital", "Chennai, Tamil Nadu", "Renowned for its advanced medical services and expertise in various fields. A leading center for liver transplants and multi-organ care."),
    ("Kamaraj Hospital", "Chennai, Tamil Nadu", "Provides comprehensive medical care and is well-regarded in the community. Committed to affordable, patient-centered healthcare services."),
    ("MGM Healthcare", "Chennai, Tamil Nadu", "A super-specialty hospital with a focus on advanced treatments. Equipped with cutting-edge technology and a team of highly skilled specialists."),
]

# Update the first 5 hospital entries (IDs 1-5)
cursor.execute("SELECT id FROM hospitals ORDER BY id LIMIT 5")
ids = [row[0] for row in cursor.fetchall()]

for i, (name, location, description) in enumerate(hospitals):
    if i < len(ids):
        cursor.execute(
            "UPDATE hospitals SET name=%s, location=%s, description=%s WHERE id=%s",
            (name, location, description, ids[i])
        )
        print(f"✓ Updated hospital ID {ids[i]}: {name}")

connection.commit()
cursor.close()
connection.close()
print("\n✅ Done! First 5 hospitals updated successfully.")
