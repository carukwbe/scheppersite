# The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
from firebase_functions import firestore_fn, https_fn

import base64
import json
import uuid
import random
import qrcode
import jinja2

from firebase_functions import https_fn, pubsub_fn, scheduler_fn, params
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
import transaction_processor

import os

from google.cloud.firestore_v1.base_query import FieldFilter


from firestore_utils import generate_ticket_pdf

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
    ticket_orders_collection = db.collection('tickets_ordered')
    count_orders_query = ticket_orders_collection.count()
    query_result = count_orders_query.get()
    amount_of_ticket_orders = query_result[0][0].value

    if amount_of_ticket_orders <= 350:
        return "no"
    else:
        return "yes"


@https_fn.on_call()
def writeTicket(form_data):
    db = firestore.client()
    input_data = form_data.data
    
    if not input_data: return {"error": "Ticket with ticket ID does not exist!"}
    
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
        }
        ticket_id = ""#input_data.get("ticket_id")

        ticket_data["helper_job_preference"] = ""
            
    except Exception:
        return {"error": "Input could not be parsed."}

    ticket_data["modified_at"] = datetime.now()
    if ticket_id == "":        
        # determine price for ticket whether it is for helpers or for regulars
        price_collection_name = "current_helper_price" if ticket_data["helper"]==True else "current_regular_price"
        ticket_price_doc = db.collection("prices").document(price_collection_name).get()
        if not ticket_price_doc.exists: return {"error": "Ticket price could not be determined."}
        ticket_data["price"] = ticket_price_doc.to_dict()["value"]
                   
        ticket_data["order_id"] = str(random.randint(100000,999999)) # perhaps check if ticket id already in database
        db.collection("tickets_ordered").document().set(ticket_data)

        return "New ticket order created successfully."

    else:
        # get data of existing ticket in "payed" collection (where it needs to be as otherwise there cannot be a
        # repersonalization)
        existing_ticket_ref = db.collection("tickets_payed").document(ticket_id)
        existing_ticket_doc = existing_ticket_ref.get()
        # remove the ticket id so that it is not written into the document in firestore

        if not existing_ticket_doc.exists: return {"error": "Ticket with ticket ID does not exist!"}
            
        existing_ticket = existing_ticket_doc.to_dict()
        # data that is not present in the input from the frontend but needs to be kept
        ticket_data["price"] = existing_ticket["price"]
        ticket_data["order_id"] = existing_ticket["order_id"]

        if existing_ticket["email"] == ticket_data["email"]:
            if (existing_ticket["name"] == ticket_data["email"]) and (existing_ticket["surname"] == ticket_data["surname"]):
                # repersonalization for same person, update in the same collection on the same document
                existing_ticket_ref.set(ticket_data)
            else:
                existing_ticket_ref.delete()
            return "Ticket repersonalized successfully."
        else:
            # repersonailzation for new person, new ticket needs to created in pending, different one in pending
            # with same order id must be removed
            other_pending_repersonalizations = db.collection("tickets_pending").where(filter=FieldFilter(
                "order_id", "==", ticket_data["order_id"])).stream()
            [db.collection("tickets_pending").document(doc.id).delete() for doc in other_pending_repersonalizations]

            db.collection("tickets_pending").document().set(ticket_data)
            return "New pending ticket created successfully."
            


@https_fn.on_call()
def newTicketConfirmed(input_data):
    db = firestore.client()
    ticket_data = input_data.data
    
    pending_ticket_doc = db.collection("tickets_pending").document(ticket_data["ticket_id"]).get()
    if not pending_ticket_doc.exists: return {"error": "Pending ticket not found!"}

    # Delete the existing ticket with the same order id from tickets_payed
    pending_ticket = pending_ticket_doc.to_dict() #          ||||| hier nicht tickets_payrd???
    payed_tickets_with_same_order_id = list(db.collection("tickets_pending").where(filter=FieldFilter(
        "order_id", "==", pending_ticket["order_id"])).stream())
        
    if len(payed_tickets_with_same_order_id) == 0:
        return {"error": "Payed ticket with order ID of pending ticket does not exist!"}
    elif len(payed_tickets_with_same_order_id) > 1:
        return {"error": "More than one payed ticket with order ID of pending ticket exists!"}
    else:
        # If there is exactly one ticket with the order ID of the pending one, delete it.
        db.collection("tickets_payed").document(payed_tickets_with_same_order_id[0].id).delete()
        # Create new ticket in tickets_payed from the one in tickets_pending
        db.collection("tickets_payed").document(ticket_data["ticket_id"]).set(pending_ticket)
        # Delete the ticket from pending tickets
        db.collection("tickets_pending").document(ticket_data["ticket_id"]).delete()

        return "New ticket created from pending ticket successfully."
    


def add_to_email_collection(recipient, subject, text, html, attachment_content, attachment_encoding, attachment_filename):
    db = firestore.client()
    message = {
        "message": {
            "attachments": {
                "content": attachment_content,
                "encoding": attachment_encoding,
                "filename": attachment_filename,
            },
            "text": text,
            "html": html,
            "subject": subject
        },
        "to": recipient
    }

    db.collection("mail").document().set(message)


@firestore_fn.on_document_created(document="tickets_ordered/{ticket_id}")
def send_confirmation_mail(event: Event[DocumentSnapshot]) -> None:
    ticket_data = event.data.to_dict()
    
    html_template_loader = jinja2.FileSystemLoader(searchpath="./")
    html_template_env = jinja2.Environment(loader=html_template_loader)
    html_template = html_template_env.get_template("confirmation_mail.html")
    html = html_template.render(name=ticket_data["name"], price=ticket_data["price"])

    with open("scheppern_ticket_template.pdf", "rb") as pdf_file:
        pdf_content = pdf_file.read()
        pdf_base64 = base64.b64encode(pdf_content).decode('utf-8')

    add_to_email_collection(recipient=ticket_data["email"], 
                            subject="Deine Bestellung ist eingegangen!",
                            text=None,
                            html=html,
                            attachment_content=pdf_base64,
                            attachment_encoding="base64",
                            attachment_filename="ticket_scheppern.pdf")
    



@firestore_fn.on_document_created(document="tickets_payed/{ticket_id}")
def send_ticket(event: Event[DocumentSnapshot]) -> None:
    ticket_data = event.data.to_dict()

    validation_url = f"http://localhost:5001/scheppersite/us-central1/validate_ticket?test"
    code = qrcode.make(validation_url)
    ticket_pdf = generate_ticket_pdf(validation_url, ticket_data["name"], ticket_data["surname"], ticket_data["order_id"],
                                     ticket_data["price"])
    encoded_ticket_pdf = base64.b64encode(ticket_pdf).decode('utf-8')
    
    html_template_loader = jinja2.FileSystemLoader(searchpath="./")
    html_template_env = jinja2.Environment(loader=html_template_loader)
    ticket_sent_html_template = html_template_env.get_template("confirmation_mail.html")
    ticket_sent_html = ticket_sent_html_template.render(name=ticket_data["name"], price=ticket_data["price"])

    add_to_email_collection(recipient=ticket_data["email"], 
                            subject="Deine Ticket ist da!",
                            text=None,
                            html=ticket_sent_html,
                            attachment_content=encoded_ticket_pdf,
                            attachment_encoding="base64",
                            attachment_filename="ticket_scheppern.pdf")
    
    return "worked"

@firestore_fn.on_document_created(document="tickets_pending/{ticket_id}")
def send_repersonalization_link():
    pass


@https_fn.on_request()
def validate_ticket(req: https_fn.Request) -> https_fn.Response:
    db = firestore.client()
    ticket_id = req.query_string.decode("utf-8")
    doc_ref = db.collection("tickets_payed").document(ticket_id)
    doc = doc_ref.get()
    if doc.exists:
        data = doc.to_dict()
        name = data["name"]
        surname = data["surname"]
        return f"{name} {surname}, Bestellnummer: {ticket_id}"
    else:
        return f"Ticket mit id {ticket_id} konnte nicht gefunden werden."



@scheduler_fn.on_schedule(schedule="0 18 * * *")
def daily_trigger_test(event: scheduler_fn.ScheduledEvent) -> None:
    print("Executed successfully")


@https_fn.on_call()
def process_transactions(req: https_fn.CallableRequest):
    transactions = transaction_processor.get_transactions()
    (
        transactions_correct_amount_correct_id,
        transactions_correct_amount_false_id,
        transactions_false_amount_correct_id
    ) = transaction_processor.filter_relevant_transactions(transactions)

    transaction_processor.process_relevant_transactions(transactions_correct_amount_correct_id, 
        transactions_correct_amount_false_id, transactions_false_amount_correct_id)
    
    print("Processing transactions finished")


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
    doc.set(ticket)


@pubsub_fn.on_message_published(topic="malicious_usage_alert")
def stop_billing_on_malicious_usage(event: pubsub_fn.CloudEvent[pubsub_fn.MessagePublishedData]) -> None:
    stop_billing()
