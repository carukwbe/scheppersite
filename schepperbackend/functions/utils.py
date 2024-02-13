import pytz

from datetime import timedelta

from firebase_functions import https_fn, logger
from google.api_core.datetime_helpers import DatetimeWithNanoseconds

from transaction_processor import get_ticket_levels

from firebase_admin import firestore

def get_current_ticket_price(ticket_data):
    logger.info("Getting ticket price")

    active_ticket_levels = []
    now = DatetimeWithNanoseconds.now(tz=pytz.UTC)
    active_ticket_levels = [ticket_level for ticket_level in get_ticket_levels() 
                        if ticket_level["active_from"] <= now and ticket_level["active_until"] > now]
    if len(active_ticket_levels) != 1: raise Exception("None or more than one active price level found!")

    price = 0
    price += active_ticket_levels[0]["regular_price"] if not ticket_data["helper"] else active_ticket_levels[0]["helper_price"]
    if ticket_data["carpass"]:
        price += (active_ticket_levels[0]["regular_carpass_price"] if not ticket_data["helper"] else 
                  active_ticket_levels[0]["helper_carpass_price"])
        
    return price



def check_if_quotas_exceeded(counter_values, quotas_collection_ref):
    logger.info("Checking if order quotas are exceeded")
    # transaction not needed because no query happens
    exceeded_counters = {}
    for key, counter_value in counter_values.items():
        if key in ["regulars", "carpasses", "helpers"]:
            quota_value_doc = quotas_collection_ref.document(key).get()
            #if not quota_value_doc.exists: raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.NOT_FOUND,
            #            message=("Quota document could not be found!"))
            quota_value = quota_value_doc.to_dict()["value"]
            if counter_value > quota_value:
                exceeded_counters[key] = {
                    "quota": quota_value,
                    "current_counter_value": counter_value
                }

    if len(exceeded_counters) != 0:
        sold_out_categories = []
        for key in exceeded_counters.keys():
            if key == "regulars": sold_out_categories.append("Regulär")
            if key == "carpasses": sold_out_categories.append("Carpass")
            if key == "helpers": sold_out_categories.append("Helfer:innen")

        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            message=(f"Folgende Ticketkategorien sind leider ausverkauft: {(', '.join(sold_out_categories))}"),
            details=exceeded_counters)



def create_order_id(ticket_data, order_number):
    logger.info("Creating new order ID")

    order_id = f"2024-{str(order_number).zfill(3)}-"
    order_id += "0-" if ticket_data["secret"] else "X-"
    order_id += "H" if ticket_data["helper"] else "X"
    order_id += "C" if ticket_data["carpass"] else "X"

    return order_id


def delete_and_archive_ticket(transaction, deleted_tickets_collection_ref, ticket_ref, ticket_doc, reason):
    transaction.set(deleted_tickets_collection_ref.document(ticket_ref.id), {
        **ticket_doc,
        "last_modified_at": DatetimeWithNanoseconds.now(tz=pytz.UTC),
        "reason": reason
    })
    transaction.delete(ticket_ref)


@firestore.transactional
def set_sent_ticket_transactional(transaction, ticket_ref):
    ticket_snapshot = ticket_ref.get(transaction=transaction)
    if not ticket_snapshot.exists: raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.PERMISSION_DENIED,
        message=("Ticket which was supposed to be marked as sent could not be found!"))
    
    transaction.update(ticket_ref, {"ticket_sent": True})


def log_error_and_return_to_frontend(exception, error_code, error_msg, details):
    logger.error({
        "error_msg": error_msg,
        **details
    }, error=str(exception))
    raise https_fn.HttpsError(code=error_code,
        message=error_msg,
        details=str({**details
    }))


def validate_secret_ticket_token(token, tokens_collection_ref):
    logger.info("Detected secret ticket, validating token")

    token_doc = tokens_collection_ref.document(token).get()
    if not token_doc.exists: raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.PERMISSION_DENIED,
                            message=("Permission denied."))
    
    datetime_token_created = token_doc.to_dict()["datetime_created"]

    if DatetimeWithNanoseconds.now(tz=pytz.UTC) - datetime_token_created > timedelta(minutes=10):
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.PERMISSION_DENIED,
                            message=("Die Sitzung ist abgelaufen! Lade die Seite neu und erstelle "
                                     "das Ticket erneut."))