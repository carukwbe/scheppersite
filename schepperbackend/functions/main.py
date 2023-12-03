# The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
from firebase_functions import firestore_fn, https_fn

import base64
import json
import uuid
import random
import logging
import os

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
from google.cloud.firestore_v1.base_query import FieldFilter

from transaction_processor import get_transactions, process_relevant_transactions, filter_relevant_transactions
from cost_controller import review_billing_event, stop_billing
from mail_handling import send_confirmation_mail, send_ticket, send_repersonalization_mail

initialize_app(
    options = {
        'projectId': 'scheppersite',
        'databaseURL': 'http://127.0.0.1:4000'  # Firestore emulator runs on this URL
    }
)

os.environ["PROJECT_ID"] = params.PROJECT_ID.value

TICKETS_COLLECTION_NAME = "tickets_temp"


@https_fn.on_call()
def tickets_available2(req: https_fn.CallableRequest):
    db = firestore.client()
    collection = db.collection('tickets')

    validTickets = collection.where('status', '==', 'valid').get()
    return 400 - len(validTickets)
    

@https_fn.on_call()
def getTicketLevels(req: https_fn.CallableRequest):
    db = firestore.client()
    ticketLevels = db.collection('ticket_levels').get()

    ticket_levels = []
    for ticket in ticketLevels:
        ticket_levels.append(ticket.to_dict())
    return ticket_levels


@https_fn.on_call()
def writeTicket2(form_data):
    db = firestore.client()
    collection = db.collection('tickets')

    input_data = form_data.data
    if not input_data: return {"error": "Invalid input"}

    ticket = {
        'name': input_data.get('name'),
        'surname': input_data.get('surname'),
        'email': input_data.get('email'),
        'phone': input_data.get('phone'),
        'hogwarts_house': input_data.get('hogwarts_house')
    }

    # returns reference to an existing ticket or a new one if the id is not found with get()
    ticketReference = collection.document(input_data.get('id'))
    ticketReference_dict = ticketReference.get().to_dict() # for data access

    # existing ticket was altered
    if input_data.get('id'):

        # e-mail has changed
        if ticketReference_dict['email'] != ticket.get('email'):

            # create new pending ticket
            pendingTicketReference = collection.document()
            pendingTicketReference.set({
                **ticket,
                'status': 'pending',
                'payed': False,
                'old_ticketID': input_data.get('id')
            })

            #delete all other pending tickets
            pendingTicketStream = collection.where('old_ticketID', '==', input_data.get('id')).stream()
            for oldPendingTickets in pendingTicketStream:
                if oldPendingTickets.id != pendingTicketReference.id:
                    oldPendingTickets.reference.delete()
                
            # update old ticket data, to have its e-mail not automatically changed by the new temporary ticket
            ticket['email'] = ticketReference_dict['email']

            # todo: send email function call

        # update original ticket
        ticketReference.update(ticket)
        return {"succes": "Ticket updated succesfully"}
    
    #new ticket was created
    ticketReference.set({
        **ticket,
        'status': 'valid',
        'payed': False,
        'date_reservated': datetime.now()
    })
    return {"succes": "Ticket created succesfully"}


@https_fn.on_call()
def tickets_available(req: https_fn.CallableRequest): #req: https_fn.Request) -> https_fn.Response: 
    db = firestore.client()
    ticket_orders_collection = db.collection(TICKETS_COLLECTION_NAME)
    count_orders_query = ticket_orders_collection.count()
    query_result = count_orders_query.get()
    amount_of_ticket_orders = query_result[0][0].value

    if amount_of_ticket_orders <= 350:
        return "no"
    else:
        return "yes"

@https_fn.on_call()
def writeTicket(form_data):
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
        ticket_id = "mJlEIG7DgVoRKskhQH0Z"#input_data.get("ticket_id")
        ticket_data["helper_job_preference"] = ""
            
    except Exception:
        return {"error": "Input could not be parsed."}

    db = firestore.client()
    tickets_collection_ref = db.collection(TICKETS_COLLECTION_NAME)

    if ticket_id == "":        
        # New ticket has been ordered
        price_doc_name = "current_helper_price" if ticket_data["helper"]==True else "current_regular_price"
        ticket_price_doc = db.collection("prices").document(price_doc_name).get()
        if not ticket_price_doc.exists: return {"error": "Ticket price could not be determined."}
        price = ticket_price_doc.to_dict()["value"]

        tickets_collection_ref.document().set({
            **ticket_data,
            "modified_at": datetime.now(),
            "order_id": str(random.randint(100000,999999)), #TODO: Check if already present in orders
            "status": "ordered",
            "price": price
        })
        send_confirmation_mail(ticket_data["name"], ticket_data["email"], price)
        return "New ticket order created successfully."

    # Existing ticket is to be repersonalized
    existing_ticket_ref = tickets_collection_ref.document(ticket_id)
    existing_ticket_doc = existing_ticket_ref.get()
    if not existing_ticket_doc.exists: return {"error": "Ticket with ticket ID does not exist!"}
            
    existing_ticket = existing_ticket_doc.to_dict()
    if existing_ticket["status"] != "payed": return {"error": "Ticket has not been payed yet!"}
        
    if existing_ticket["email"] == ticket_data["email"]:
        existing_ticket_ref.set({
            **ticket_data,
            "modified_at": datetime.now(),
            "order_id": existing_ticket["order_id"],
            "status": existing_ticket["status"],
            "price": existing_ticket["price"]
        })
        if (existing_ticket["name"] != ticket_data["name"]) or (existing_ticket["surname"] != ticket_data["surname"]):
            # If the name changed, send another ticket.
            send_ticket(ticket_id=ticket_id,
                        name=ticket_data["name"], 
                        surname=ticket_data["surname"], 
                        email=existing_ticket["email"],
                        order_id=existing_ticket["order_id"],
                        price=existing_ticket["price"])

        return "Ticket repersonalized successfully."
    
    # E-Mail has been changed, so create new pending ticket.
    other_pending_repersonalizations = tickets_collection_ref.where(
        filter=FieldFilter("status", "==", "pending")).where(
        filter=FieldFilter("order_id", "==", existing_ticket["order_id"])).stream()
    [tickets_collection_ref.document(doc.id).delete() for doc in other_pending_repersonalizations]

    _, pending_ticket_ref = tickets_collection_ref.add({
        **ticket_data,
        "modified_at": datetime.now(),
        "order_id": existing_ticket["order_id"],
        "status": "pending",
        "price": existing_ticket["price"]
    })
    send_repersonalization_mail(ticket_id=pending_ticket_ref.id, 
                                old_name=existing_ticket["name"], 
                                new_name=ticket_data["name"], 
                                email=ticket_data["email"])
            
    return "New pending ticket created successfully."
            

@https_fn.on_call()
def newTicketConfirmed(form_data):
    ticket_data = form_data.data

    db = firestore.client()
    tickets_collection_ref = db.collection(TICKETS_COLLECTION_NAME)
    
    pending_ticket_doc = tickets_collection_ref.document(ticket_data["ticket_id"]).get()
    if not pending_ticket_doc.exists: return {"error": "Pending ticket not found!"}

    pending_ticket = pending_ticket_doc.to_dict()
    if pending_ticket["status"] != "pending": return {"error": "Ticket status is not pending!"}
    
    payed_tickets_with_same_order_id = list(tickets_collection_ref.where(
        filter=FieldFilter("status", "==", "payed")).where(
        filter=FieldFilter("order_id", "==", pending_ticket["order_id"]))
        .stream())
        
    if len(payed_tickets_with_same_order_id) == 0:
        return {"error": "Payed ticket with order ID of pending ticket does not exist!"}
    elif len(payed_tickets_with_same_order_id) > 1:
        return {"error": "More than one payed ticket with order ID of pending ticket exists!"}
    else:
        # Delete the payed ticket from the collection so that a new one must be created, so that the ticket id changes,
        # so that repersonalization does not work anymore for the old person.
        tickets_collection_ref.document(payed_tickets_with_same_order_id[0].id).delete()
        pending_ticket["status"] = "payed"
        tickets_collection_ref.document(ticket_data["ticket_id"]).set(pending_ticket)
        send_ticket(ticket_id=ticket_data["ticket_id"], 
                    name=pending_ticket["name"], 
                    surname=pending_ticket["surname"], 
                    email=pending_ticket["email"], 
                    order_id=pending_ticket["order_id"],
                    price=pending_ticket["price"])
        
        return "New ticket created from pending ticket successfully."


@https_fn.on_request()
def validate_ticket(req: https_fn.Request) -> https_fn.Response:
    ticket_id = req.query_string.decode("utf-8")
    
    db = firestore.client()
    doc_ref = db.collection(TICKETS_COLLECTION_NAME).document(ticket_id)
    doc = doc_ref.get()
    
    if not doc.exists: return f"Ticket mit id {ticket_id} konnte nicht gefunden werden."
    data = doc.to_dict()
    if data["status"] != "payed": return "Ticket wurde noch nicht bezahlt!"

    return f'{data["name"]} {data["surname"]}, Bestellnummer: {data["order_id"]}'
    
        

@https_fn.on_request()
def process_transactions(req: https_fn.Request) -> https_fn.Response:
    transactions = get_transactions()
    (
        transactions_correct_amount_correct_id,
        transactions_correct_amount_false_id,
        transactions_false_amount_correct_id
    ) = filter_relevant_transactions(transactions)

    process_relevant_transactions(transactions_correct_amount_correct_id, transactions_correct_amount_false_id,
                                  transactions_false_amount_correct_id)
    
    print("Processing transactions finished")

    return "ok"


@scheduler_fn.on_schedule(schedule="0 10 * * *")
def order_lifecycle_handler(event: scheduler_fn.ScheduledEvent) -> None:
    db = firestore.client()
    for ticket_order_doc in db.collection(TICKETS_COLLECTION_NAME).where(filter=FieldFilter("status", "==", "ordered")).stream():
        ticket_order = ticket_order_doc.to_dict()
        order_date = ticket_order["modified_at"]
        if (order_date is None) or (order_date==""): logging.exception("Order date is invalid.")
        

@scheduler_fn.on_schedule(schedule="0 18 * * *")
def daily_trigger_test(event: scheduler_fn.ScheduledEvent) -> None:
    print("Executed successfully")


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
