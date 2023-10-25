# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
import firebase_admin
from firebase_admin import firestore
from datetime import datetime

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
def createOrUpdateTicket(ticket):
    collection = db.collection('tickets')

    input_data = ticket.data
    if input_data is None:
        return {"error": "Invalid input"}

    ticket = {
        'name': input_data.get('name'),
        'surname': input_data.get('surname'),
        'email': input_data.get('email'),
        'phone': input_data.get('phone'),
        'hogwarts_house': input_data.get('hogwarts_house'),
        'date_reservated': datetime.now()
    }

    doc = collection.document(input_data.get('id'))
    doc.set(ticket)

    return "Data written to Firestore"



