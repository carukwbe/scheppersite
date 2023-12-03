import json
from datetime import datetime
import uuid

from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter

from nordigen import NordigenClient

from firestore_utils import get_field_value_of_all_documents
from mail_handling import send_ticket

def get_transactions():
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
    for doc in firestore.client().collection("tickets_temp").where(
        filter=FieldFilter("status", "==", "ordered")).stream():
        order_id = doc.to_dict()["order_id"]
        if order_id is not None and order_id != "": all_order_ids.append(order_id)

    ticket_prices = get_field_value_of_all_documents("prices", "value")

    # Loop through all transactions and append the ones where the ticket price was transferred to us or the
    # verwendungszweck is one of the ids to the list
    for idx, transaction in enumerate(transactions["transactions"]["booked"]):
        verwendungszweck = transaction["remittanceInformationUnstructured"]
        amount = float(transaction["transactionAmount"]["amount"])

        if (amount in ticket_prices) and (verwendungszweck in all_order_ids):
            transactions_correct_amount_correct_id.append(transaction)
        elif (amount in ticket_prices) and (verwendungszweck not in all_order_ids):
            transactions_correct_amount_false_id.append(transaction)
        elif (amount not in ticket_prices) and (verwendungszweck in all_order_ids):
            transactions_false_amount_correct_id.append(transaction)
        else:
            pass
    
    return transactions_correct_amount_correct_id, transactions_correct_amount_false_id, transactions_false_amount_correct_id


def store_faulty_transaction(transaction, collection_name):
 
    db = firestore.client()
    data = {
        "sender": transaction["creditorName"],
        "sender_iban": transaction["creditorAccount"]["iban"],
        "amount": float(transaction["transactionAmount"]["amount"]),
        "verwendungszweck": transaction["remittanceInformationUnstructured"],
        "created_at": datetime.now()
    }
    db.collection(collection_name).document().set(data)


def process_relevant_transactions(transactions_correct_amount_correct_id, transactions_correct_amount_false_id, 
    transactions_false_amount_correct_id):

    db = firestore.client()
    tickets_collection_ref = db.collection("tickets_temp")
    for transaction in transactions_correct_amount_correct_id:
        verwendungszweck = transaction["remittanceInformationUnstructured"]
                
        orders_with_order_id = list(tickets_collection_ref.where(
            filter=FieldFilter("status", "==", "ordered")).where(
            filter=FieldFilter("order_id", "==", verwendungszweck)).stream())
        
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
            if float(transaction["transactionAmount"]["amount"]) == ticket_order["price"]:
                tickets_collection_ref.document(orders_with_order_id[0].id).update({"status": "payed"})
                send_ticket(ticket_id=orders_with_order_id[0].id, 
                            name=ticket_order["name"],
                            surname=ticket_order["surname"],
                            email=ticket_order["email"],
                            order_id=ticket_order["order_id"],
                            price=ticket_order["price"]
                )
            else:
                store_faulty_transaction(transaction, collection_name="transactions_false_amount_correct_id")

    for transaction in transactions_correct_amount_false_id:
        store_faulty_transaction(transaction, collection_name="transactions_correct_amount_false_id")

    for transaction in transactions_false_amount_correct_id:
        store_faulty_transaction(transaction, collection_name="transactions_false_amount_correct_id")