# The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
from firebase_functions import firestore_fn, https_fn

import base64
import json
import uuid
import random

from firebase_functions import https_fn, pubsub_fn, params
from firebase_admin import firestore, initialize_app
from datetime import datetime
from firebase_functions.firestore_fn import (
  on_document_updated,
  on_document_created,
  Event,
  Change,
  DocumentSnapshot,
)

from cost_controller import review_billing_event, stop_billing
import ticket_manager
import ticket_validator

import os

# cred = credentials.application_default()
# cred = credentials.Certificate("path/to/your/serviceAccountKey.json")
# firebase_admin.initialize_app(cred)

initialize_app(
    options={
        'projectId': 'scheppersite',
        'databaseURL': 'http://127.0.0.1:4000'  # Firestore emulator runs on this URL
    }
)

os.environ["PROJECT_ID"] = params.PROJECT_ID.value


@https_fn.on_call()
def tickets_available(req: https_fn.CallableRequest): #req: https_fn.Request) -> https_fn.Response:
    db = firestore.client()
    ticket_orders_collection = db.collection('ticket_orders')
    count_orders_query = ticket_orders_collection.count()
    query_result = count_orders_query.get()
    amount_of_ticket_orders = query_result[0][0].value

    if amount_of_ticket_orders <= 350:
        return "no"
    else:
        return "yes"


app = initialize_app()

# for local emulator
# app = initialize_app(
#     options = {
#         'projectId': 'scheppersite',
#         'databaseURL': 'http://127.0.0.1:4000'  # Firestore emulator runs on this URL
#     }
# )


@https_fn.on_call()
def writeTicket(input_data):
    input_data = input_data.data
    if input_data is not None:
        try:
            ticket_data = {
                'name': input_data.get('name'),
                'surname': input_data.get('surname'),
                'email': input_data.get('email'),
                'phone': input_data.get('phone'),
                'hogwarts_house': input_data.get('hogwarts_house'),
                'helper': input_data.get("helper"),
                #'helper_job_preference': input_data.get('helper_job_preference'),
                'helper_time_preference': input_data.get('timePreferences'),
                #'ticket_id': input_data.get('ticket_id'),
            }
            ticket_data["ticket_id"] = ""
            ticket_data["helper_job_preference"] = ""
            
        except Exception:
            return {"error": "Input could not be parsed."}

        ticket_data["modified_at"] = datetime.now()

        db = firestore.client()
        if ticket_data["ticket_id"] == "":
            ticket_id = str(uuid.uuid4())
            
            # determine price for ticket whether it is for helpers or for regulars
            price_collection_name = "current_helper_price" if ticket_data["helper"]==True else "current_regular_price"
            ticket_price_doc = db.collection("prices").document(price_collection_name).get()
            if ticket_price_doc.exists:
                ticket_price = ticket_price_doc.to_dict()["value"]
            else:
                return {"error": "Ticket price could not be determined."}
            
            ticket_data["order_id"] = random.randint(100000,999999) # perhaps check if ticket id already in database
            ticket_data["price"] = ticket_price
            ticket_data.pop("ticket_id")

            new_ticket_ref = db.collection("tickets_payed").document(ticket_id)
            new_ticket_ref.set(ticket_data)

            return "New ticket order created successfully."

        else:
            # get data of existing ticket in "payed" collection (where it needs to be as otherwise there cannot be a
            # repersonalization)
            existing_ticket_ref = db.collection("tickets_payed").document(ticket_data["ticket_id"])
            existing_ticket_doc = existing_ticket_ref.get()
            # remove the ticket id so that it is not written into the document in firestore
            ticket_data.pop("ticket_id")

            if existing_ticket_doc.exists:
                existing_ticket = existing_ticket_doc.to_dict()
                # data that is not present in the input from the frontend but needs to be kept
                ticket_data["price"] = existing_ticket["price"]
                ticket_data["order_id"] = existing_ticket["order_id"]

                if existing_ticket["email"] == ticket_data["email"]:
                    # repersonalization for same person, update in the same collection 
                    existing_ticket_ref.set(ticket_data)
                    return "Ticket repersonalized successfully."
                else:
                    # repersonailzation for new person, new ticket needs to created in pending, different one in pending
                    # with same order id must be removed
                    other_pending_repersonalizations = db.collection("tickets_pending").where(filter=FieldFilter(
                        "order_id", "==", ticket_data["order_id"])).stream()
                    for doc in other_pending_repersonalizations:
                        db.collection("tickets_pending").document(doc.id).delete()

                    pending_ticket_id = str(uuid.uuid4())
                    pending_ticket_ref = db.collection("tickets_pending").document(pending_ticket_id)
                    pending_ticket_ref.set(ticket_data)

                    return "New pending ticket created successfully."
            else:
                return {"error": "Ticket with ticket ID does not exist!"}
    else:
        return {"error": "Invalid input"}




@pubsub_fn.on_message_published(topic="project_cost")
def monitor_project_cost(event: pubsub_fn.CloudEvent[pubsub_fn.MessagePublishedData]) -> None:
    billing_event_data = event.data.message.data
    billing_event_data_decoded = base64.b64decode(billing_event_data).decode("utf-8")
    billing_event_data_json = json.loads(billing_event_data_decoded)
    budget_exceeded = review_billing_event(billing_event_data_json)
    if budget_exceeded:
        stop_billing()

    db = firestore.client()
    collection = db.collection('project_cost')

    ticket = {
        'ticket': billing_event_data_json
    }

    doc = collection.document(str(uuid.uuid4()))
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


@pubsub_fn.on_message_published(topic="malicious_usage_alert")
def stop_billing_on_malicious_usage(event: pubsub_fn.CloudEvent[pubsub_fn.MessagePublishedData]) -> None:
    stop_billing()