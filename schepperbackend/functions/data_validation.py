from firebase_functions import https_fn
from pydantic import BaseModel, ConfigDict, StringConstraints, StrictBool, EmailStr, ValidationError, conlist
from typing_extensions import Annotated, Optional
from utils import log_error_and_return_to_frontend

class CreateTicketInputValidation(BaseModel):
    model_config = ConfigDict(extra='forbid')

    name: Annotated[str, StringConstraints(min_length=1, max_length=50, pattern=r'^[ A-Za-z\u00C0-\u017F-]+$')]
    surname: Annotated[str, StringConstraints(min_length=1, max_length=50, pattern=r'^[ A-Za-z\u00C0-\u017F-]+$')]
    email: Annotated[EmailStr, StringConstraints(min_length=1, max_length=50, pattern=r'^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}+$')]
    phone: Optional[Annotated[str, StringConstraints(max_length=20, pattern=r'\+?[0-9 ]*')]]
    carpass: StrictBool
    carpass_wish: Optional[StrictBool]
    helper: StrictBool
    helper_wish: Optional[StrictBool]
    helper_shifts: conlist(Annotated[str, StringConstraints(min_length=1, max_length=20, pattern=r'^[A-Za-z\u00C0-\u017F\d-]+$')], max_length=20)
    helper_infos: Annotated[str, StringConstraints(max_length=50, pattern=r'^[ A-Za-z\u00C0-\u017F\d,:().?!]*$')]
    agbs_accepted: StrictBool
    data_protection_accepted: StrictBool
    over_18: StrictBool
    secret: Optional[StrictBool]
    secret_token: Optional[Annotated[str, StringConstraints(min_length=1, max_length=30, pattern=r'^[A-Za-z\u00C0-\u017F\d-]+$')]]


class EditTicketInputValidation(BaseModel):
    model_config = ConfigDict(extra='forbid')

    ticket_id: Annotated[str, StringConstraints(min_length=1, max_length=30, pattern=r'^[A-Za-z\u00C0-\u017F\d-]+$')]
    name: Annotated[str, StringConstraints(min_length=1, max_length=50, pattern=r'^[ A-Za-z\u00C0-\u017F-]+$')]
    surname: Annotated[str, StringConstraints(min_length=1, max_length=50, pattern=r'^[ A-Za-z\u00C0-\u017F-]+$')]
    email: Optional[Annotated[EmailStr, StringConstraints(min_length=1, max_length=50, pattern=r'^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}*$')]]
    phone: Optional[Annotated[str, StringConstraints(max_length=20, pattern=r'\+?[0-9 ]*')]]
    helper: Optional[StrictBool]
    helper_shifts: Optional[conlist(Annotated[str, StringConstraints(min_length=1, max_length=20, pattern=r'^[A-Za-z\u00C0-\u017F\d-]+$')], max_length=20)]
    helper_infos: Optional[Annotated[str, StringConstraints(max_length=1000, pattern=r'^[ A-Za-z\u00C0-\u017F\d,:().?!]*$')]]


class ContactFormMessageInputValidation(BaseModel):
    model_config = ConfigDict(extra='forbid')
    email: Optional[Annotated[EmailStr, StringConstraints(max_length=50, pattern=r'^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}*$')]]
    phone: Optional[Annotated[str, StringConstraints(max_length=20, pattern=r'\+?[0-9 ]*')]]
    ticket_id: Optional[Annotated[str, StringConstraints(max_length=30, pattern=r'^[A-Za-z\u00C0-\u017F\d-]*$')]]
    message: Annotated[str, StringConstraints(min_length=1, max_length=1000, pattern=r'^[ A-Za-z\u00C0-\u017F\d,:().?!]*$')]


class TicketIdInputValidation(BaseModel):
    model_config = ConfigDict(extra='forbid')
    ticket_id: Annotated[str, StringConstraints(min_length=1, max_length=30, pattern=r'^[A-Za-z\u00C0-\u017F\d-]+$')]


class AdminLoginInputValidation(BaseModel):
    model_config = ConfigDict(extra='forbid')
    username: Annotated[str, StringConstraints(pattern=r'^[ A-Za-z\u00C0-\u017F-]+$')]
    password: Annotated[str, StringConstraints(pattern=r'^[ A-Za-z\u00C0-\u017F-]+$')]


class GetTicketWithOrderIdInputValidation(BaseModel):
    model_config = ConfigDict(extra='forbid')
    secret_token: Optional[Annotated[str, StringConstraints(min_length=1, max_length=30, pattern=r'^[A-Za-z\u00C0-\u017F\d-]+$')]]
    order_id: Annotated[str, StringConstraints(min_length=1, max_length=30, pattern=r'^[ A-Za-z\u00C0-\u017F0-9-]+$')]


def validate_ticket_id(ticket_id, error_msg):
    try:
        TicketIdInputValidation(ticket_id = ticket_id)
    except ValidationError as e:
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            message=(f"Ticket ID is not a valid string! Value: {ticket_id}"),
            details=str({
                "ticket_id": ticket_id,
                "Exception": str(e)
            }))


def get_invalid_fields(validation_error):
    invalid_fields = []
    
    for error in validation_error.errors():
        for item in error["loc"]:
            invalid_fields.append(item)

    return invalid_fields


def validate_contact_form_input(contact_form_input):
    try:
        contact_form_data = {
            'email': contact_form_input.get("email"),
            'phone': contact_form_input.get("phone"),
            'ticket_id': contact_form_input.get('ticketID'),
            'message': contact_form_input.get('message'),
        }
        if contact_form_data["email"]=="": contact_form_data["email"] = None # Data validation would flag emtpy string
        ContactFormMessageInputValidation(**contact_form_data)
        return contact_form_data
    except ValidationError as e:
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
                        message=(f"Abschicken fehlgeschlagen! Folgende Felder enthalten ungültige Zeichen: "
                                 f"{(', '.join(get_invalid_fields(e)))}"))
    except Exception as e:
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
                        message=(f"Übergebene Daten konnten nicht verarbeitet werden! Fehler: {str(e)}"),
                        details=str(contact_form_input))


def validate_edit_ticket_input(input_data):
    try:
        ticket_data = {
            'ticket_id': input_data.get("id"),
            'name': input_data.get('name'),
            'surname': input_data.get('surname'),
            'email': input_data.get('email'),
            'phone': input_data.get('phone'),
            'helper': input_data.get("helper"),
            'helper_shifts': input_data.get('helperShifts'),
            'helper_infos': input_data.get('helperInfos'),
        }
        if ticket_data["helper"] == None: 
            ticket_data["helper"] = False
        EditTicketInputValidation(**ticket_data)
        return ticket_data
    except ValidationError as e:
        error_msg = f"Bearbeiten fehlgeschlagen! Folgende Felder enthalten ungültige Zeichen: {(', '.join(get_invalid_fields(e)))}"
        log_error_and_return_to_frontend(e, https_fn.FunctionsErrorCode.INVALID_ARGUMENT, error_msg, {"ticket_data": ticket_data})
    except Exception as e:
        error_msg = f"Übergebene Daten konnten nicht verarbeitet werden!"
        log_error_and_return_to_frontend(e, https_fn.FunctionsErrorCode.INVALID_ARGUMENT, error_msg, {"input_data": input_data})


def validate_create_ticket_input(input_data):
    try:
        ticket_data = {
            'name': input_data.get('name'),
            'surname': input_data.get('surname'),
            'email': input_data.get('email'),
            'phone': input_data.get('phone'),
            'carpass': input_data.get('carpass'),
            'carpass_wish': input_data.get('carpassWish'),
            'helper': input_data.get("helper"),
            'helper_wish': input_data.get("helperWish"),
            'helper_shifts': input_data.get('helperShifts'),
            'helper_infos': input_data.get('helperInfos'),
            'agbs_accepted': input_data.get('agbsAccepted'),
            'data_protection_accepted': input_data.get('dataProtectionAccepted'),
            'over_18': input_data.get('over18'),
            'secret': input_data.get('secret'),
            'secret_token': input_data.get('secret_token')
        }
        if (not ticket_data["agbs_accepted"]) | (not ticket_data["data_protection_accepted"]) | (not ticket_data["over_18"]):
            raise ValueError("AGBs und/oder Datenschutzbedingungen und/oder Altersbeschränkung wurde nicht akzeptiert!")
        # When secret ticket is not set True by frontend, the field does not get sent for security reasons. In that case, we
        # set it False manually to restrict it to boolean values in every case
        if ticket_data["secret"] == None:
            ticket_data["secret"] = False
        CreateTicketInputValidation(**ticket_data)
        return ticket_data
    except ValidationError as e:
        error_msg = f"Bestellung fehlgeschlagen! Folgende Felder enthalten ungültige Zeichen: {(', '.join(get_invalid_fields(e)))}"
        log_error_and_return_to_frontend(e, https_fn.FunctionsErrorCode.INVALID_ARGUMENT, error_msg, {"ticket_data": ticket_data})
    except Exception as e:
        error_msg = f"Übergebene Daten konnten nicht verarbeitet werden!"
        log_error_and_return_to_frontend(e, https_fn.FunctionsErrorCode.INVALID_ARGUMENT, error_msg, {"ticket_data": ticket_data})



def validate_admin_login_input(input_data):
    try:
        login_data = {
            'username': input_data.get("username"),
            'password': input_data.get('password'),
        }
        AdminLoginInputValidation(**login_data)
        return login_data
    except ValidationError as e:
        error_msg = f"Anmelden fehlgeschlagen!"
        log_error_and_return_to_frontend(e, https_fn.FunctionsErrorCode.INVALID_ARGUMENT, error_msg, {"login_data": login_data})
    except Exception as e:
        error_msg = f"Übergebene Anmeldedaten konnten nicht verarbeitet werden!"
        log_error_and_return_to_frontend(e, https_fn.FunctionsErrorCode.INVALID_ARGUMENT, error_msg, {"login_data": login_data})


def validate_get_tickets_input(input_data):
    try:
        get_tickets_data = {
            'secret_token': input_data.get("secretToken"),
            'order_id': input_data.get('orderId'),
        }
        print(get_tickets_data)
        GetTicketWithOrderIdInputValidation(**get_tickets_data)
        return get_tickets_data
    except ValidationError as e:
        error_msg = f"Ticketabruf fehlgeschlagen! Folgende Felder enthalten ungültige Zeichen: {(', '.join(get_invalid_fields(e)))}"
        log_error_and_return_to_frontend(e, https_fn.FunctionsErrorCode.INVALID_ARGUMENT, error_msg, {"ticket_data": get_tickets_data})
    except Exception as e:
        error_msg = f"Übergebene Daten konnten nicht verarbeitet werden!"
        log_error_and_return_to_frontend(e, https_fn.FunctionsErrorCode.INVALID_ARGUMENT, error_msg, {"input_data": input_data})