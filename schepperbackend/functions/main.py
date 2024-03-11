# import base64
# import json
# import uuid
# import os
# import pytz

# import ticket_status_checks
# import utils

# from firebase_functions import https_fn, pubsub_fn, scheduler_fn, params, logger
# from firebase_admin import firestore, initialize_app
# from firebase_functions.firestore_fn import on_document_created, on_document_deleted, Event, DocumentSnapshot
# from firebase_functions.params import SecretParam

# from google.cloud.firestore_v1.base_query import FieldFilter, Or
# from google.api_core.datetime_helpers import DatetimeWithNanoseconds

# from datetime import datetime, timedelta
# from pydantic import ValidationError

# from transaction_processor import get_ticket_levels, get_transactions, process_relevant_transactions, filter_relevant_transactions
# from cost_controller import review_billing_event, stop_billing
# from mail_handling import (send_confirmation_mail, send_regular_ticket, send_repersonalization_validation_mail, send_payment_reminder, 
#     send_order_deletion_mail, send_mail_on_faulty_transaction, send_mail_on_contact_form_message, send_secret_ticket_validation_mail,
#     send_repersonalization_origin_mail, send_repersonalization_origin_success_mail, send_secret_ticket)
# from data_validation import TicketIdInputValidation, validate_contact_form_input, validate_create_ticket_input, validate_edit_ticket_input, validate_admin_login_input, validate_get_tickets_input


# initialize_app(
#     options = {
#         'projectId': 'scheppersite',
#         'databaseURL': 'http://127.0.0.1:4000'  # Firestore emulator runs on this URL
#     }
# )

# os.environ["PROJECT_ID"] = params.PROJECT_ID.value

# TICKETS_COLLECTION_NAME = "tickets"


# NORDIGEN_SECRET_ID = SecretParam('NORDIGEN_SECRET_ID')
# NORDIGEN_SECRET_KEY = SecretParam('NORDIGEN_SECRET_KEY')
# NORDIGEN_REQUISITION_ID = SecretParam('NORDIGEN_REQUISITION_ID')

# # notes on transactions:
# #   - transactional functions must have the @firestore.transactional decorator
# #   - a transactional function cannot (should not?) be called from another transactional function
# #   - a transactional function must include one (or more?) read and one or more write statements, otherwise the abortion mechanism does not kick in
# #   - methods that take transactions as arguments but are not transactional themselves become part of the transaction as if the method was not even a separate piece. Can be seen with delete_and_archive_ticket
# #   - even if an error happens after a write method in a transaction and before the return statement, the transaction is aborted
# #   - two transactions in two methods do not influence each other, even if they are passed the same db.transaction() object



# @https_fn.on_call(region="europe-west3", max_instances=1)
# def get_ticket(ticket_id):
#     ticket_id = ticket_id.data
#     logger.info(f"Executing get_ticket.", ticket_id=ticket_id)
#     try:
#         TicketIdInputValidation(ticket_id=ticket_id)
#     except ValidationError as e:
#         error_msg = "Ticket ID did not pass data validation!"
#         utils.log_error_and_return_to_frontend(e, https_fn.FunctionsErrorCode.INVALID_ARGUMENT, error_msg, details={})
    
#     db = firestore.client()
#     ticket_ref = db.collection(TICKETS_COLLECTION_NAME).document(ticket_id).get()
#     if not ticket_ref.exists: raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
#                             message=("Ticket mit der ID konnte nicht gefunden werden!"),
#                             details=ticket_id)
    
#     ticket = ticket_ref.to_dict()
#     logger.info("Executed get_ticket successfully", ticket_id=ticket_id)
    
#     return ticket



# @firestore.transactional
# def refresh_category_counters(transaction, tickets_collection_ref, counters_collection_ref):
#     logger.info("Refreshing ticket category counters.")
#     counter_refs = {
#         "regulars": counters_collection_ref.document("regulars"),
#         "helpers": counters_collection_ref.document("helpers"),
#         "carpasses": counters_collection_ref.document("carpasses")
#     }
#     not_pending_or_other_filter = Or(filters=[FieldFilter("status", "==", "ordered"), FieldFilter("status", "==", "payed"),
#                                               FieldFilter("status", "==", "scanned")])
#     counter_queries = {
#         "regulars": tickets_collection_ref.where(
#             filter=not_pending_or_other_filter).where(
#             filter=FieldFilter("helper", "==", False)).count(),
#         "helpers": tickets_collection_ref.where(
#             filter=not_pending_or_other_filter).where(
#             filter=FieldFilter("helper", "==", True)).count(),
#         "carpasses": tickets_collection_ref.where(
#             filter=not_pending_or_other_filter).where(
#             filter=FieldFilter("carpass", "==", True)).count()
#     }
#     counter_values = {key: counter_query.get(transaction=transaction)[0][0].value 
#                       for key, counter_query in counter_queries.items()}

#     [transaction.update(counter_ref, {"value": counter_values[key]}) for key, counter_ref in counter_refs.items()]

#     return counter_values


# @firestore.transactional
# def create_ticket_transactional(transaction, ticket_data, counters_collection_ref, quotas_collection_ref, 
#                                 category_counter_values, price, tickets_collection_ref):
    
#     logger.info("Fetching and incrementing order counters")
#     order_counter_name = "secret_tickets" if ticket_data["secret"] else "orders"
#     relevant_category_counters = []
#     relevant_category_counters.append("helpers") if ticket_data["helper"] else relevant_category_counters.append("regulars")
#     if ticket_data["carpass"]: relevant_category_counters.append("carpasses")

#     order_counter_snapshot = counters_collection_ref.document(order_counter_name).get(transaction=transaction)

#     new_category_counter_values = {key: counter_value+1 if key in relevant_category_counters else counter_value 
#                                    for key, counter_value in category_counter_values.items()}
    
#     new_counter_values = {
#         order_counter_name: order_counter_snapshot.get("value")+1,
#         **new_category_counter_values
#     }
#     # Here so they are part of the transaction. Transactions are only proper if at their start is a read and at their end
#     # is a write.
#     if not ticket_data["secret"]: utils.check_if_quotas_exceeded(new_counter_values, quotas_collection_ref)
#     order_id = utils.create_order_id(ticket_data, new_counter_values[order_counter_name])

#     logger.info("Writing order documents to firestore")
#     # writing the ticket is part of the transaction so that the counters are not updated if the write fails
#     ticket_ref = tickets_collection_ref.document()

#     created_ticket_data = {
#         **ticket_data,
#         "order_date": DatetimeWithNanoseconds.now(tz=pytz.UTC),
#         "last_modified_at": DatetimeWithNanoseconds.now(tz=pytz.UTC),
#         "order_id": order_id,
#         "status": "pending" if ticket_data["secret"] else "ordered",
#         "price": price,
#         "reminded": False,
#         "ticket_sent": False
#     }

#     transaction.set(ticket_ref, created_ticket_data)

#     [transaction.update(counters_collection_ref.document(key), {"value": counter_value}) for key, counter_value 
#      in new_counter_values.items()]

#     return created_ticket_data, ticket_ref.id



# @https_fn.on_call(region="europe-west3", max_instances=1, cpu="gcf_gen1", memory=256)
# def create_ticket(req: https_fn.CallableRequest):
#     execution_id = str(uuid.uuid4())
#     logger.info("Executing create_ticket", {"request": str(req), "execution_id": execution_id})

#     ticket_data = validate_create_ticket_input(req.data)

#     db = firestore.client()
#     if ticket_data["secret"]: utils.validate_secret_ticket_token(ticket_data["secret_token"], db.collection("secret_ticket_tokens"))
#     ticket_data.pop("secret_token")

#     # maybe move into transaction
#     price = utils.get_current_ticket_price(ticket_data)

#     transaction = db.transaction()
#     tickets_collection_ref = db.collection(TICKETS_COLLECTION_NAME)
#     counters_collection_ref = db.collection("counters")
#     quotas_collection_ref = db.collection("ticket_quotas")

#     # for being extra safe that we have the current numbers
#     category_counter_values = refresh_category_counters(transaction, tickets_collection_ref, counters_collection_ref)
#     # failure in create ticket does not revert refreshing despite shared transaction, probably because read opeations must come before writes
#     created_ticket_data, ticket_id = create_ticket_transactional(transaction, ticket_data, counters_collection_ref, 
#                                                                  quotas_collection_ref, category_counter_values, price, 
#                                                                  tickets_collection_ref)

#     if created_ticket_data["secret"]:
#         logger.info("Sending secret ticket validation mail")
#         send_secret_ticket_validation_mail(ticket_id=ticket_id,
#                     name=created_ticket_data["name"], 
#                     email=created_ticket_data["email"])
#         ret_message = "Ticketerstellung erfolgreich."
#     else:
#         logger.info("Sending order confirmation mail")
#         send_confirmation_mail(created_ticket_data["name"], created_ticket_data["email"], created_ticket_data["price"], 
#                             created_ticket_data["order_id"])
#         ret_message =  "Bestellung erfolgreich! Du erhältst nun eine E-Mail mit den Überweisungsdaten."

#     logger.info("Executed create_ticket successfully")
#     return ret_message



# @firestore.transactional
# def edit_ticket_transactional(transaction, existing_ticket_ref, ticket_data, ticket_id, tickets_collection_ref, 
#                               deleted_tickets_collection_ref):
#     existing_ticket_snapshot = existing_ticket_ref.get(transaction=transaction)

#     if not existing_ticket_snapshot.exists: raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.PERMISSION_DENIED,
#                             message=("Ticket mit der ID", ticket_id, " konnte nicht gefunden werden!"))
#     existing_ticket = existing_ticket_snapshot.to_dict()

#     ticket_status_checks.check_if_edit_ticket_allowed(existing_ticket)

#     if (existing_ticket["email"] == ticket_data["email"]) or (ticket_data["email"] == None):
#         # Second case is for ticket edit with greyed-out email field (happens for repersonalization before payment)
#         transaction.update(existing_ticket_ref, {
#             **ticket_data,
#             "email": existing_ticket["email"],
#             "last_modified_at": DatetimeWithNanoseconds.now(tz=pytz.UTC),
#             "order_id": existing_ticket["order_id"],
#             "status": existing_ticket["status"],
#             "price": existing_ticket["price"]
#         })

#         if (existing_ticket["name"] != ticket_data["name"]) or (existing_ticket["surname"] != ticket_data["surname"]):
#             transaction.update(existing_ticket_ref, {"ticket_sent": False})
#             return "name_change", existing_ticket, None
        
#         return "telephone_number_change", None, None
        
#     # Repersonalization only possible for payed tickets, scanned has been flagged before
#     ticket_status_checks.check_if_repersonalization_allowed(existing_ticket)

#     other_pending_repersonalizations = tickets_collection_ref.where(
#         filter=FieldFilter("status", "==", "pending")).where(
#         filter=FieldFilter("order_id", "==", existing_ticket["order_id"])).stream(transaction=transaction)
    
#     [utils.delete_and_archive_ticket(transaction, deleted_tickets_collection_ref, doc.reference, doc.to_dict(), 
#                               reason="Overwritten by other repersonalization.") for doc in other_pending_repersonalizations]

#     pending_ticket_ref = tickets_collection_ref.document()
#     transaction.set(pending_ticket_ref, {
#         **existing_ticket,
#         **ticket_data,
#         "last_modified_at": DatetimeWithNanoseconds.now(tz=pytz.UTC),
#         "status": "pending",
#         "ticket_sent": False
#     })
#     return "repersonalization", existing_ticket, pending_ticket_ref.id


# @https_fn.on_call(region="europe-west3", max_instances=1)
# def edit_ticket(form_data):
#     print(form_data)
#     input_data = form_data.data
#     ticket_data = validate_edit_ticket_input(input_data)

#     ticket_id = ticket_data["ticket_id"]
#     del ticket_data["ticket_id"] # TODO: schauen ob durch pop() schöner

#     db = firestore.client()
#     transaction = db.transaction()
#     tickets_collection_ref = db.collection(TICKETS_COLLECTION_NAME)
#     existing_ticket_ref = tickets_collection_ref.document(ticket_id)
#     deleted_tickets_collection_ref = db.collection("deleted_tickets")
    

#     edit_type, existing_ticket, pending_ticket_id = edit_ticket_transactional(transaction, existing_ticket_ref, ticket_data, 
#                                                                       ticket_id, tickets_collection_ref, 
#                                                                       deleted_tickets_collection_ref)
    
#     if edit_type == "name_change":
#         ret_message = "Ticketdaten erfolgreich geändert."
#         if existing_ticket["status"] == "payed":
#             send_regular_ticket(ticket_id=ticket_id,
#                         name=ticket_data["name"], # name and surname have changed, so we use the ticket_data dict, which contains the edited data
#                         surname=ticket_data["surname"], 
#                         email=existing_ticket["email"],
#                         order_id=existing_ticket["order_id"],
#                         price=existing_ticket["price"],
#                         carpass=existing_ticket["carpass"],
#                         helper=existing_ticket["helper"])
            
#             utils.set_sent_ticket_transactional(db.transaction(), existing_ticket_ref)
#             ret_message += " Wir schicken dir ein neues Ticket mit dem aktualisierten Namen."

#         return ret_message

#     elif edit_type == "repersonalization":
#         send_repersonalization_validation_mail(ticket_id=pending_ticket_id, # is in this case the ticket id of the new pending ticket
#                                 name=existing_ticket["name"], 
#                                 email=ticket_data["email"])
        
#         send_repersonalization_origin_mail(ticket_id, existing_ticket["name"], existing_ticket["email"])

#         return ("Das Ticket für die Person, an die du es überträgst, wurde erfolgreich in unserer Datenbank gespeichert. "
#                 "Es wurde eine E-Mail an die Person zum Annahme des Tickets gesendet.")
    
#     elif edit_type == "telephone_number_change":
#         return "Ticketdaten erfolgreich geändert."
#     else:
#         raise RuntimeError("This should not be possible!")       


# @firestore.transactional    
# def cancel_ticket_transactional(transaction, existing_ticket_ref, deleted_tickets_collection_ref):
#     existing_ticket_snapshot = existing_ticket_ref.get(transaction=transaction)
#     if not existing_ticket_snapshot.exists: raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
#                         message=("Das Ticket konnte nicht gefunden werden!"))
#     existing_ticket_doc = existing_ticket_snapshot.to_dict()
#     ticket_status_checks.check_if_cancel_ticket_allowed(existing_ticket_doc)

#     utils.delete_and_archive_ticket(transaction, deleted_tickets_collection_ref, existing_ticket_snapshot.reference, 
#                                     existing_ticket_doc, reason="order cancelled")
    
#     return existing_ticket_doc, existing_ticket_snapshot.id


# @https_fn.on_call(region="europe-west3", max_instances=1)
# def delete_ticket(req: https_fn.CallableRequest):
#     ticket_id = req.data
#     try:
#         TicketIdInputValidation(ticket_id = ticket_id)
#     except ValidationError as e:
#         error_msg = "Deine Ticket ID konnte nicht verarbeitet werden!"
#         utils.log_error_and_return_to_frontend(e, https_fn.FunctionsErrorCode.INVALID_ARGUMENT, error_msg, 
#                                                {"ticket_id": ticket_id})
    
#     db = firestore.client()
#     deleted_tickets_collection_ref = db.collection("deleted_tickets")
#     existing_ticket_ref =  db.collection(TICKETS_COLLECTION_NAME).document(ticket_id)

#     cancelled_ticket, cancelled_ticket_id = cancel_ticket_transactional(db.transaction(), existing_ticket_ref, 
#                                                                         deleted_tickets_collection_ref)
    
#     send_order_deletion_mail(cancelled_ticket["name"], cancelled_ticket["email"], cancelled_ticket_id)

#     return "Ticket erfolgreich storniert."



# @firestore.transactional    
# def validate_ticket_transactional(transaction, tickets_collection_ref, deleted_tickets_collection_ref, pending_ticket_id):
#     pending_ticket_doc = tickets_collection_ref.document(pending_ticket_id).get(transaction=transaction)
#     if not pending_ticket_doc.exists: raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
#                         message=("Die Umpersonalisierung konnte nicht gefunden werden! Möglicherweise wurde das Ticket, nachdem "
#                                  "es auf dich übertragen wurde, auf eine andere Person übertragen. Melde dich bei der Person, "
#                                  "die dir das Ticket übertragen hat."))
#     pending_ticket = pending_ticket_doc.to_dict()
#     print(pending_ticket)

#     old_ticket = None

#     if not pending_ticket["secret"]:
#         ticket_status_checks.check_if_validate_ticket_allowed(pending_ticket)

#         scanned_tickets_with_same_order_id = list(tickets_collection_ref.where(
#             filter=FieldFilter("status", "==", "scanned")).where(
#             filter=FieldFilter("order_id", "==", pending_ticket["order_id"])).stream(transaction=transaction))
        
#         if len(scanned_tickets_with_same_order_id) != 0:
#             raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
#                 message=(f"Ein Ticket mit der gleichen Bestellnummer wurde bereits beim Festival gescant! Annahme der "
#                          "Umpersonalisierung nicht mehr möglich."))
        
#         payed_tickets_with_same_order_id = list(tickets_collection_ref.where(
#             filter=FieldFilter("status", "==", "payed")).where(
#             filter=FieldFilter("order_id", "==", pending_ticket["order_id"])).stream(transaction=transaction))
        
#         # here to aviod read after write error for transaction. list() command is important, otherwise the documents won't actually get read, it would happen in the for loop where iteration over them happens.
#         pending_tickets_with_same_order_id = list(tickets_collection_ref.where(
#             filter=FieldFilter("status", "==", "pending")).where(
#             filter=FieldFilter("order_id", "==", pending_ticket["order_id"])).stream(transaction=transaction))

#         if (len(payed_tickets_with_same_order_id) == 0):
#             raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
#                 message=("Dem Ticket konnte kein bezahltes oder noch nicht gescanntes Ticket zugeordnet werden. "
#                         "Wende dich bitte an uns über das Kontaktformular! Schicke uns den Link, mit dem du diese "
#                         "Seite erreicht hast, mit."),
#                 details=str({"ticket_id": pending_ticket_id}))
#         elif len(payed_tickets_with_same_order_id) > 1:
#             raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
#                             message=("Zum übertragenen Ticket existiert mehr als ein bezahltes!"),
#                             details=str({"ticket_id": pending_ticket_id}))
#         else:
#             old_ticket_doc = payed_tickets_with_same_order_id[0]
#             old_ticket = old_ticket_doc.to_dict()
#             utils.delete_and_archive_ticket(transaction, deleted_tickets_collection_ref, old_ticket_doc.reference, 
#                                             old_ticket, reason="pending ticket validated")

#         # just in case somehow there is more than one pending ticket
#         for doc in pending_tickets_with_same_order_id:
#             utils.delete_and_archive_ticket(transaction, deleted_tickets_collection_ref, doc.reference, doc.to_dict(), 
#                                             reason="pending ticket validated")

#     transaction.set(tickets_collection_ref.document(pending_ticket_id), {
#         **pending_ticket,
#         "status": "payed",
#         "last_modified_at": DatetimeWithNanoseconds.now(tz=pytz.UTC)
#     })

#     return pending_ticket, old_ticket
        

# @https_fn.on_call(region="europe-west3", max_instances=1)
# def validate_ticket(req: https_fn.CallableRequest):
#     pending_ticket_id = req.data
#     try:
#         TicketIdInputValidation(ticket_id = pending_ticket_id)
#     except Exception as e:
#         error_msg = ("Wir konnten deine Ticket ID nicht verarbeiten! Sie hat wahrscheinlich ein inkorrektes Format."
#                     "Wende dich bitte an uns über das Kontaktformular! Schicke uns den Link, mit dem du diese Seite "
#                     "erreicht hast, mit.")
#         utils.log_error_and_return_to_frontend(e, https_fn.FunctionsErrorCode.INVALID_ARGUMENT, error_msg, 
#                                                {"pending_ticket_id": pending_ticket_id})
    
#     db = firestore.client()
#     pending_ticket, old_ticket = validate_ticket_transactional(db.transaction(), db.collection(TICKETS_COLLECTION_NAME), 
#                                                    db.collection("deleted_tickets"), pending_ticket_id)
#     if pending_ticket["secret"]:
#         send_secret_ticket(ticket_id=pending_ticket_id, 
#                     name=pending_ticket["name"], 
#                     surname=pending_ticket["surname"], 
#                     email=pending_ticket["email"], 
#                     order_id=pending_ticket["order_id"],
#                     price=pending_ticket["price"],
#                     carpass=pending_ticket["carpass"],
#                     helper=pending_ticket["helper"])
#     else:
#         send_regular_ticket(ticket_id=pending_ticket_id, 
#                     name=pending_ticket["name"], 
#                     surname=pending_ticket["surname"], 
#                     email=pending_ticket["email"], 
#                     order_id=pending_ticket["order_id"],
#                     price=pending_ticket["price"],
#                     carpass=pending_ticket["carpass"],
#                     helper=pending_ticket["helper"])
    
#     utils.set_sent_ticket_transactional(db.transaction(), db.collection(TICKETS_COLLECTION_NAME).document(pending_ticket_id))

#     if old_ticket:
#         send_repersonalization_origin_success_mail(old_ticket["name"], old_ticket["email"])

#     return {
#         "success": True,
#         "name": pending_ticket["name"],
#         "surname": pending_ticket["surname"],
#         "order_id": pending_ticket["order_id"]
#     }
    
    
# @firestore.transactional
# def scan_ticket_transactional(transaction, tickets_collection_ref, deleted_tickets_collection_ref, ticket_id, 
#                               festival_start_time):
#     ticket_ref = tickets_collection_ref.document(ticket_id)
#     ticket_snapshot = ticket_ref.get(transaction=transaction)
#     if not ticket_snapshot.exists: raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.PERMISSION_DENIED,
#                             message=("Ticket konnte nicht gefunden werden."),
#                             details=ticket_id)
#     ticket_doc = ticket_snapshot.to_dict()

#     ticket_status_checks.check_if_ticket_scannable(ticket_doc)

#     ret_message_addition = ""
#     if DatetimeWithNanoseconds.now(tz=pytz.UTC) >= festival_start_time:
#         pending_repersonalizations_stream = tickets_collection_ref.where(
#             filter=FieldFilter("status", "==", "pending")).where(
#             filter=FieldFilter("order_id", "==", ticket_doc["order_id"])).stream()
#         [utils.delete_and_archive_ticket(transaction, deleted_tickets_collection_ref, doc.reference, doc.to_dict(), 
#          reason="Original ticket scanned while festival") for doc in pending_repersonalizations_stream]
#         ret_message_addition += (" ACHTUNG: Da wir uns kurz vor Beginn des Festivals befinden, haben wir alle ausstehenden \n"
#                                 "Umpersonalisierungen für das Ticket entfernt. Wir tun das, damit niemand, der/die sich \n"
#                                 "bereits auf dem Festivalgelände befindet, das Ticket noch weitergeben kann.")
    
#         transaction.update(ticket_ref, {
#             "status": "scanned",
#             "last_modified_at": DatetimeWithNanoseconds.now(tz=pytz.UTC)
#         })
#     return ticket_doc, ret_message_addition



# @https_fn.on_call(region="europe-west3", max_instances=1)
# def scan_ticket(req: https_fn.CallableRequest):
#     ticket_id = req.data
#     logger.info(f"Executing scan_ticket with ticket_id \"{ticket_id}\"")
#     try:
#         TicketIdInputValidation(ticket_id = ticket_id)
#     except Exception as e:
#         error_msg = ("Wir konnten die Ticket ID nicht verarbeiten! Sie hat wahrscheinlich ein inkorrektes Format. "
#                     "Melde dich bei der IT!")
#         utils.log_error_and_return_to_frontend(e, https_fn.FunctionsErrorCode.INVALID_ARGUMENT, error_msg, details={})

#     db = firestore.client()
#     transaction = db.transaction()
#     tickets_collection_ref = db.collection(TICKETS_COLLECTION_NAME)
#     deleted_tickets_collection_ref = db.collection("deleted_tickets")

#     festival_start_doc = db.collection("dates").document("festival_start").get()
#     if not festival_start_doc.exists: raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
#                             message=("Document for festival start date could not be found"))
#     festival_start_time = festival_start_doc.to_dict()["value"]

#     scanned_ticket_doc, ret_message_addition = scan_ticket_transactional(transaction, tickets_collection_ref,
#                                                                          deleted_tickets_collection_ref, ticket_id, 
#                                                                          festival_start_time)
    
#     return {
#         "message": f"Scan erfolgreich.{ret_message_addition}",
#         "data": {
#             "success": True,
#             "name": scanned_ticket_doc["name"],
#             "surname": scanned_ticket_doc["surname"],
#             "carpass": scanned_ticket_doc["carpass"],
#             "helper": scanned_ticket_doc["helper"],
#             "order_id": scanned_ticket_doc["order_id"]
#         }
#     }


# @on_document_created(document="tickets/{ticket_id}", max_instances=1)
# def refresh_counters_on_create(event: Event[DocumentSnapshot]) -> None:
#     db = firestore.client()
#     refresh_category_counters(db.transaction(), db.collection(TICKETS_COLLECTION_NAME), db.collection("counters"))


# @on_document_deleted(document="tickets/{ticket_id}", max_instances=1)
# def refresh_counters_on_delete(event: Event[DocumentSnapshot]) -> None:
#     db = firestore.client()
#     refresh_category_counters(db.transaction(), db.collection(TICKETS_COLLECTION_NAME), db.collection("counters"))



# def _process_transactions(use_mock):
#     transactions = get_transactions(use_mock, NORDIGEN_SECRET_ID.value, NORDIGEN_SECRET_KEY.value, 
#                                     NORDIGEN_REQUISITION_ID.value)
#     (
#         transactions_correct_amount_correct_id,
#         transactions_correct_amount_false_id,
#         transactions_false_amount_correct_id
#     ) = filter_relevant_transactions(transactions)

#     process_relevant_transactions(transactions_correct_amount_correct_id, transactions_correct_amount_false_id,
#                                   transactions_false_amount_correct_id)


# @https_fn.on_request(region="europe-west3", max_instances=1, 
#                      secrets=[NORDIGEN_SECRET_ID, NORDIGEN_SECRET_KEY, NORDIGEN_REQUISITION_ID])
# def process_transactions_req(req: https_fn.Request) -> https_fn.Response:
#     _process_transactions(use_mock=True)

#     return "Processing transactions finished"


# @scheduler_fn.on_schedule(schedule="0 * * * *", region="europe-west3", max_instances=1, 
#                           secrets=[NORDIGEN_SECRET_ID, NORDIGEN_SECRET_KEY, NORDIGEN_REQUISITION_ID])
# def process_transactions(event: scheduler_fn.ScheduledEvent) -> None:
#     _process_transactions(use_mock=False)


# @firestore.transactional
# def order_lifecycle_handler_transactional(transaction, tickets_collection_ref, deleted_tickets_collection_ref,
#                                           days_until_reminder, days_until_deletion):
#     now = DatetimeWithNanoseconds.now(tz=pytz.UTC)
#     tickets_to_delete = []
#     tickets_to_remind = []

#     for doc in tickets_collection_ref.where(
#         filter=FieldFilter("status", "==", "ordered")).where(
#         filter=FieldFilter("reminded", "==", False)).stream(transaction=transaction):

#         order_date = doc.to_dict()["order_date"]
#         if (order_date is None) or (order_date==""): print("asd") # TODO: 
        
#         time_elapsed_since_order = now-order_date
#         if time_elapsed_since_order > timedelta(days=days_until_deletion):
#             utils.delete_and_archive_ticket(transaction, deleted_tickets_collection_ref, doc.reference, doc.to_dict(), 
#                                             reason="Order expired")
#             tickets_to_delete.append((doc.to_dict(), doc.id))
#         elif  time_elapsed_since_order > timedelta(days=days_until_reminder):
#             tickets_to_remind.append((doc.to_dict(), doc.id))
#             transaction.update(doc.reference, {"reminded": True})
#         else:
#             pass
    
#     return tickets_to_delete, tickets_to_remind


# def _order_lifecycle_handler():
#     db = firestore.client()

#     dates_collection_ref = db.collection("dates")
#     days_until_reminder_doc = dates_collection_ref.document("days_until_reminder").get()
#     days_until_deletion_doc = dates_collection_ref.document("days_until_deletion").get()

#     if not (days_until_reminder_doc.exists and days_until_deletion_doc.exists): raise https_fn.HttpsError(
#         code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
#         message=("Documents for days until reminding or deletion could not be found."))

#     days_until_reminder = days_until_reminder_doc.to_dict()["value"]
#     days_until_deletion = days_until_deletion_doc.to_dict()["value"]

#     tickets_to_delete, tickets_to_remind = order_lifecycle_handler_transactional(db.transaction(), db.collection("tickets"),
#                                                                                  db.collection("deleted_tickets"),
#                                                                                  days_until_reminder,
#                                                                                  days_until_deletion)
#     for (ticket, ticket_id) in tickets_to_delete:
#         send_order_deletion_mail(ticket["name"], ticket["email"], ticket_id)
        
#     for (ticket, ticket_id) in tickets_to_remind:
#         send_payment_reminder(ticket["name"], ticket["email"], ticket["price"], ticket["order_id"], ticket["order_date"],
#                               days_until_deletion, ticket_id)



# @scheduler_fn.on_schedule(schedule="0 10 * * *", max_instances=1, region="europe-west3")
# def order_lifecycle_handler(event: scheduler_fn.ScheduledEvent) -> None:
#     _order_lifecycle_handler()


# @https_fn.on_request(region="europe-west3", max_instances=1)
# def order_lifecycle_handler_req(req: https_fn.Request) -> https_fn.Response:
#     _order_lifecycle_handler()
#     return "ok"


# @on_document_created(document="faulty_transactions/{doc_id}")
# def notify_admins_on_faulty_transaction(event: Event[DocumentSnapshot]) -> None:
#     send_mail_on_faulty_transaction()


# @https_fn.on_call(region="europe-west3", max_instances=1)
# def save_message_from_contact_form(form_data):
#     print("alskdnalskdn", form_data)
#     contact_form_data = validate_contact_form_input(form_data.data)

#     db = firestore.client()
#     db.collection("contact_form").document(str(DatetimeWithNanoseconds.now(tz=pytz.UTC))).set({
#         **contact_form_data,
#     })
#     send_mail_on_contact_form_message(contact_form_data["email"], contact_form_data["phone"], 
#                                       contact_form_data["ticket_id"], contact_form_data["message"])

#     return "Nachricht erfolgreich übermittelt."


# @https_fn.on_call(region="europe-west3", max_instances=1)
# def admin_login(req: https_fn.CallableRequest):
#     print(req)
    
#     login_data = validate_admin_login_input(req.data)

#     passed_username = login_data["username"]
#     passed_password = login_data["password"]

#     db = firestore.client()
#     credentials_collection_ref = db.collection("admin_credentials")
#     username_doc = credentials_collection_ref.document("username").get()
#     password_doc = credentials_collection_ref.document("password").get()

#     if not (username_doc.exists and password_doc.exists): raise https_fn.HttpsError(
#         code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
#         message=("Username or password document could not be found."))
    
#     username = username_doc.to_dict()["value"]
#     password = password_doc.to_dict()["value"]

#     print(passed_username, username, passed_password, password)

#     if not ((passed_username == username) and (passed_password == password)):
#         raise https_fn.HttpsError(
#         code=https_fn.FunctionsErrorCode.PERMISSION_DENIED,
#         message=("Username oder Passwort falsch."))    

#     token_doc_ref = db.collection("secret_ticket_tokens").document()
#     token_doc_ref.set({
#         "datetime_created": DatetimeWithNanoseconds.now(tz=pytz.UTC)
#     })

#     return token_doc_ref.id


# @https_fn.on_call(region="europe-west3", max_instances=1, concurrency=1)
# def get_tickets_with_order_id(req: https_fn.CallableRequest):
#     get_tickets_data = validate_get_tickets_input(req.data)
    
#     db = firestore.client()
#     utils.validate_secret_ticket_token(get_tickets_data["secret_token"], db.collection("secret_ticket_tokens"))
    
#     tickets_with_order_id = [doc.to_dict() for doc in db.collection(TICKETS_COLLECTION_NAME).where(
#         filter=FieldFilter("order_id", "==", get_tickets_data["order_id"])).stream()]
    
#     return tickets_with_order_id

# '''
# @https_fn.on_call(region="europe-west3", max_instances=1)
# def log_headers(req: https_fn.CallableRequest):
#     db = firestore.client()
#     doc_ref = db.collection('http_logs').document()
#     doc_ref.set(req.headers)

#     return 'Headers saved successfully!'
# '''

# @pubsub_fn.on_message_published(topic="project_cost", max_instances=1, region="europe-west3")
# def monitor_project_cost(event: pubsub_fn.CloudEvent[pubsub_fn.MessagePublishedData]) -> None:

#     billing_event_data = event.data.message.data
#     billing_event_data_decoded = base64.b64decode(billing_event_data).decode("utf-8")
#     billing_event_data_json = json.loads(billing_event_data_decoded)
#     budget_exceeded = review_billing_event(billing_event_data_json)
#     if budget_exceeded:
#         stop_billing()

#     db = firestore.client()
#     collection = db.collection('project_cost')

#     ticket = {
#         'ticket': billing_event_data_json
#     }

#     doc = collection.document(str(uuid.uuid4()))
#     doc.set(ticket)


# @pubsub_fn.on_message_published(topic="malicious_usage_alert", max_instances=1, region="europe-west3")
# def stop_billing_on_malicious_usage(event: pubsub_fn.CloudEvent[pubsub_fn.MessagePublishedData]) -> None:
#     stop_billing()
    