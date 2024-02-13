import json
from google.api_core.datetime_helpers import DatetimeWithNanoseconds
import uuid

import utils

from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter

from nordigen import NordigenClient
import pytz

from mail_handling import send_regular_ticket


def get_ticket_levels():
    db = firestore.client()
    ticket_levels = []
    for price_level_doc in db.collection("price_levels").stream():
        ticket_levels.append(price_level_doc.to_dict())
    
    return ticket_levels


def get_transactions(use_mock, nordigen_secret_id, nordigen_secret_key, nordigen_requisition_id):
    
    client = NordigenClient(
        secret_id=nordigen_secret_id,
        secret_key=nordigen_secret_key
    )

    token_data = client.generate_token()
    new_token = client.exchange_token(token_data["refresh"])

    accounts = client.requisition.get_requisition_by_id(
        requisition_id=nordigen_requisition_id
    )

    # Get account id from the list.
    account_id = accounts["accounts"][0]
    # Create account instance and provide your account id from previous step
    api_connection = client.account_api(id=account_id)

    transactions = api_connection.get_transactions()
    print("asd", transactions["transactions"]["booked"][0])

    if use_mock:
        with open("nordigen_response.json", "r") as nordigen_response:
            transactions = json.load(nordigen_response)

    return transactions


def filter_relevant_transactions(transactions):
    '''
    Returns all transactions where the ticket price was transferred to us or the verwendungszweck matches one of
    the ticket ids in our database, or both.
    '''
    transactions_correct_amount_correct_id = []
    transactions_correct_amount_false_id = []
    transactions_false_amount_correct_id = []

    # Get the order ids in our database and the prices to look out for
    all_order_ids = []
    for doc in firestore.client().collection("tickets").where(
        filter=FieldFilter("status", "==", "ordered")).stream():
        order_id = doc.to_dict()["order_id"]
        if order_id is not None and order_id != "": all_order_ids.append(order_id)

    print(all_order_ids)

    ticket_prices = []
    for price_level in get_ticket_levels():
        ticket_prices += [price_level["regular_price"], price_level["regular_price"]+price_level["regular_carpass_price"],
                          price_level["helper_price"], price_level["helper_price"]+price_level["helper_carpass_price"]]
        

    print(ticket_prices)
    # Loop through all transactions and append the ones where the ticket price was transferred to us or the
    # verwendungszweck is one of the ids to the list
    for idx, transaction in enumerate(transactions["transactions"]["booked"]):
        verwendungszweck = transaction["remittanceInformationUnstructured"]
        amount = float(transaction["transactionAmount"]["amount"])
        if (amount in ticket_prices) and (verwendungszweck in all_order_ids):
            transactions_correct_amount_correct_id.append(transaction)
            print("1")
        elif (amount in ticket_prices) and (verwendungszweck not in all_order_ids):
            transactions_correct_amount_false_id.append(transaction)
            print("2")
        elif (amount not in ticket_prices) and (verwendungszweck in all_order_ids):
            transactions_false_amount_correct_id.append(transaction)
            print("3")
        else:
            pass
    
    return transactions_correct_amount_correct_id, transactions_correct_amount_false_id, transactions_false_amount_correct_id


def store_faulty_transaction(transaction, fault_name):
    db = firestore.client()
    db.collection("faulty_transactions").document(f"{transaction['bookingDate']}--{transaction['internalTransactionId']}").set({
        "sender": transaction["creditorName"],
        "sender_iban": transaction["creditorAccount"]["iban"],
        "amount": float(transaction["transactionAmount"]["amount"]),
        "verwendungszweck": transaction["remittanceInformationUnstructured"],
        "type": fault_name
    })


@firestore.transactional
def process_relevant_transactions_transactional(db_transaction, transaction, tickets_collection_ref, verwendungszweck):
    orders_with_order_id = list(tickets_collection_ref.where(
        filter=FieldFilter("status", "==", "ordered")).where(
        filter=FieldFilter("order_id", "==", verwendungszweck)).stream(transaction=db_transaction))
    if len(orders_with_order_id) == 0:
        print(f"ERROR: Error during processing transaction with valid verwendungszweck and amount: No ticket "
            f"order with order ID {verwendungszweck} found!")
    elif len(orders_with_order_id) > 1:
        print(f"ERROR: Error during processing transaction with valid verwendungszweck and amount: "
            f"{len(orders_with_order_id)} orders with order ID {verwendungszweck} found!")
    else:
        # If there is exactly one ticket with the order ID of the order, send a ticket,
        # but only when the amount is the one in the ticket.
        ticket_order = orders_with_order_id[0].to_dict()
        ticket_id = orders_with_order_id[0].id
        if float(transaction["transactionAmount"]["amount"]) == ticket_order["price"]:
            db_transaction.update(tickets_collection_ref.document(ticket_id), {
                "status": "payed",
                "last_modified_at": DatetimeWithNanoseconds.now(tz=pytz.UTC)
            })
            return True, ticket_order, ticket_id

        return False, None, None


def process_relevant_transactions(transactions_correct_amount_correct_id, transactions_correct_amount_false_id, 
    transactions_false_amount_correct_id):

    db = firestore.client()
    tickets_collection_ref = db.collection("tickets")
    for transaction in transactions_correct_amount_correct_id:
        verwendungszweck = transaction["remittanceInformationUnstructured"]

        success, ticket_order, ticket_id = process_relevant_transactions_transactional(db.transaction(), transaction, tickets_collection_ref, verwendungszweck)
        if success:
            send_regular_ticket(ticket_id=ticket_id, 
                        name=ticket_order["name"],
                        surname=ticket_order["surname"],
                        email=ticket_order["email"],
                        order_id=ticket_order["order_id"],
                        price=ticket_order["price"],
                        carpass=ticket_order["carpass"],
                        helper=ticket_order["helper"])
            utils.set_sent_ticket_transactional(db.transaction(), tickets_collection_ref.document(ticket_id))
        else:
            store_faulty_transaction(transaction, fault_name="false_amount_correct_id")

    for transaction in transactions_correct_amount_false_id:
        store_faulty_transaction(transaction, fault_name="correct_amount_false_id")

    for transaction in transactions_false_amount_correct_id:
        store_faulty_transaction(transaction, fault_name="false_amount_correct_id")