# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
import firebase_admin
from firebase_admin import credentials, firestore

# cred = credentials.application_default()
# cred = credentials.Certificate("path/to/your/serviceAccountKey.json")
# firebase_admin.initialize_app(cred)

firebase_admin.initialize_app(
    options={
        'projectId': 'scheppersite',
        'databaseURL': 'http://127.0.0.1:4000'  # Firestore emulator runs on this URL
    }
)

db = firestore.client()

@https_fn.on_call()
def createOrUpdateTicket(data):
    input_data = data.data

    if input_data is not None:
        # Define the data you want to write to Firestore
        ticket = {
            'name': input_data.get('name'),
            'message': input_data.get('message')
        }

        # Specify the Firestore collection and document ID
        collection = db.collection('tickets')
        document_id = 'your_document_id2'  # You can also use auto-generated document IDs by omitting this line

        # Use set() to create a new document or update an existing one
        doc = collection.document()
        doc.set(input_data)

        return "Data written to Firestore"
    else:
        return {"error": "Invalid input"}


