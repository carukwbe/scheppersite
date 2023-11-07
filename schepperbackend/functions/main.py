# The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
from firebase_functions import firestore_fn, https_fn

# The Firebase Admin SDK to access Cloud Firestore.
from firebase_admin import initialize_app, firestore
from datetime import datetime


app = initialize_app()

# for local emulator
# app = initialize_app(
#     options = {
#         'projectId': 'scheppersite',
#         'databaseURL': 'http://127.0.0.1:4000'  # Firestore emulator runs on this URL
#     }
# )


@https_fn.on_call() 
def writeTicket(form_data):
    db = firestore.client()
    collection = db.collection('tickets')

    input_data = form_data.data
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
