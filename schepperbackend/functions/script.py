import os
from google.cloud import firestore

# Set Firestore emulator host and port
os.environ["FIRESTORE_EMULATOR_HOST"] = "localhost:8080"

# Initialize Firestore client
db = firestore.Client()

try:
    collection_ref = db.collection("test_collection")
    doc_ref = collection_ref.set({"test_field": "test_value"})

    print("Data added successfully.")
except Exception as e:
    print(f"Error adding data: {e}")

# Example ticketLevels data
ticket_levels_data = [
    {
        "price": 45,
        "active": False,
        "name": "Early Robin",
        "activationDate": "01.11.2023",
    },
    {
        "price": 50,
        "active": True,
        "name": "Mid Eagle",
        "activationDate": "01.12.2023",
    },
    {
        "price": 55,
        "active": False,
        "name": "Late Owl",
        "activationDate": "01.01.2024",
    },
]


# Reference to the general_information collection
general_info_ref = db.collection("general_info")

# Add each ticket level as a document
for ticket_level_data in ticket_levels_data:
    try:
        general_info_ref.add(ticket_level_data)
        print("Data added successfully.")
    except Exception as e:
        print(f"Error adding data: {e}")
