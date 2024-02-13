from firebase_functions import https_fn


def check_if_repersonalization_allowed(existing_ticket):
    # Repersonalization only possible for payed tickets, scanned has been flagged before
    if existing_ticket["status"] == "ordered":
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
            message=("Das Ticket, für das eine Umpersonalisierung angefordert wurde, wurde noch nicht bezahlt!"))
    elif existing_ticket["status"] == "pending":
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
            message=("Das Ticket, für das eine Umpersonalisierung angefordert wurde, muss noch angenommen werden. Es wurde"
                    " selbst durch eine Umpersonalisierung erstellt."))
    elif existing_ticket["status"] == "scanned":
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
            message=("Das Ticket, wurde bereits beim Festival gescant. Es kann keine Umpersonalisierung mehr stattfinden."))
    elif existing_ticket["status"] != "payed":
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
            message=("Das Ticket, für das eine Umpersonalisierung angefordert wurde, hat einen ungültigen Status! "
                     f"Status: {existing_ticket['status']}"))

    if existing_ticket["helper"]:
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
        message=("Helfer*innen-Tickets können leider nicht umpersonalisiert werden!"))



# edit ticket
def check_if_edit_ticket_allowed(existing_ticket):
    if existing_ticket["status"] == "scanned": # Editing not possible for tickets which have already been scanned.
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
            message=("Das Ticket wurde bereits gescant! Keine Änderung mehr möglich."))
    elif existing_ticket["status"] not in ["payed", "ordered", "pending"]:
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
            message=("Das Ticket hat einen ungültigen Status.")) # TODO: status loggen


# cancel ticket
def check_if_cancel_ticket_allowed(existing_ticket_doc):
    if (existing_ticket_doc["status"] == "payed") | (existing_ticket_doc["status"] == "scanned"): 
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
                                  message=("Das Ticket wurde bereits bezahlt! Stornierung nicht möglich."))
    elif (existing_ticket_doc["status"] == "pending"):
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
                                  message=(f"Das Ticket ist aus einer Umpersonalisierung entstanden. Stornierung nicht möglich."))
    elif (existing_ticket_doc["status"] != "ordered"): 
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
                                  message=(f"Das Ticket hat einen ungültigen Status! Status {existing_ticket_doc['status']}"))
    else: 
        pass




# validate 
def check_if_validate_ticket_allowed(pending_ticket):
    if pending_ticket["status"] == "scanned":
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
                                  message=("Das Ticket wurde bereits beim Festival gescanned!"))
    if pending_ticket["status"] == "payed":
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
                                  message=("Das Ticket wurde bereits angenommen!"))
    elif pending_ticket["status"] == "ordered": 
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
                                  message=("Das Ticket wurde noch nicht bezahlt!"))
    elif pending_ticket["status"] != "pending":
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
                                  message=(f"Das Ticket hat einen ungültigen Status! Status: {pending_ticket['status']}"))
    else:
        pass

# scan 
def check_if_ticket_scannable(ticket_doc):
    if ticket_doc["status"] == "ordered": 
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.PERMISSION_DENIED,
            message=(f"Ticket wurde noch nicht bezahlt. Vorname: {ticket_doc['name']}, Nachname: {ticket_doc['surname']}, "
                     f"Carpass: {ticket_doc['carpass']}, Helfer:in {ticket_doc['helper']}, Bestellnummer: {ticket_doc['order_id']}"))
    elif ticket_doc["status"] == "pending": 
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.PERMISSION_DENIED,
            message=(f"Ticket kommt von einer Umpersonalisierung, es muss noch angenommen werden. Vorname: {ticket_doc['name']}, "
                     f"Nachname: {ticket_doc['surname']}, Carpass: {ticket_doc['carpass']}, Helfer:in {ticket_doc['helper']}, "
                     f"Bestellnummer: {ticket_doc['order_id']}"))
    elif (ticket_doc["status"] != "payed") & (ticket_doc["status"] != "scanned"):
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.PERMISSION_DENIED,
            message=(f"Ticket hat einen ungültigen Status! Melde dich bei der IT! Status: {ticket_doc['status']}"))
    else:
        pass