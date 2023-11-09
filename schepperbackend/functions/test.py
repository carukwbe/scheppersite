import base64
import jinja2
import io

from PyPDF2 import PdfReader, PdfWriter
from fpdf import FPDF
import qrcode

from data_validation import EditTicketInputValidation

import base64
import json
import uuid
import random
import logging
import os
import pytz

from firebase_functions import https_fn, pubsub_fn, scheduler_fn, params, logger
from firebase_admin import firestore, initialize_app
from firebase_functions.firestore_fn import on_document_created, Event, DocumentSnapshot

from google.cloud.firestore_v1 import aggregation
from google.cloud.firestore_v1.base_query import FieldFilter, Or
from google.api_core.datetime_helpers import DatetimeWithNanoseconds

from datetime import datetime, timedelta
from pydantic import ValidationError

from transaction_processor import get_ticket_levels, get_transactions, process_relevant_transactions, filter_relevant_transactions
from cost_controller import review_billing_event, stop_billing
from mail_handling import (send_confirmation_mail, send_ticket, send_payment_reminder
    , send_mail_on_faulty_transaction, send_mail_on_contact_form_message)
from data_validation import CreateTicketInputValidation, EditTicketInputValidation, TicketIdInputValidation, ContactFormMessageInputValidation

initialize_app(
    options = {
        'projectId': 'scheppersite',
        'databaseURL': 'http://127.0.0.1:4000'  # Firestore emulator runs on this URL
    }
)

# Function to convert PDF file to base64
def pdf_to_base64(pdf_file_path):
    # Read PDF file in binary mode
    with open(pdf_file_path, "rb") as pdf_file:
        pdf_content = pdf_file.read()
    
    # Encode PDF content to base64 string
    pdf_base64 = base64.b64encode(pdf_content).decode('utf-8')
    return pdf_base64

'''
# Replace 'path_to_pdf.pdf' with your PDF file path
base64_string = pdf_to_base64('DPG_Urkunde.pdf')

with open("pdf_base64.txt", "w") as pd:
    pd.write(base64_string)

'''


def generate_ticket_pdf():
    validation_url = "http://www.scheppernaufbrettern.de"
    name = "Moritz"
    surname = "Leugers"
    order_id = "2024-001-X-XX"
    price = 50
    qr_code = qrcode.make(validation_url)
    qr_code_io = io.BytesIO(qr_code.tobytes())
    qr_code.save(qr_code_io, "PNG")
    qr_code_io.seek(0)

    qr_code_png = qr_code_io.read()
    qr_code_png_io = io.BytesIO(qr_code_png)

    pdf = FPDF("L", "mm", (400, 750))
    pdf.add_page()
    pdf.add_font("Jost", "", "Jost-SemiBold.ttf")
    pdf.set_font("Jost", "", size=55)
    pdf.set_fill_color(255,255,255)
    pdf.set_xy(660, 200)
    pdf.cell(30, 50, text=order_id)
    pdf.set_xy(575, 321)
    pdf.cell(30, 50, text=str(price))
    pdf.set_font("Jost", "", size=55)
    pdf.set_xy(25, 200)
    pdf.cell(30, 50, text=f"{name} {surname}")
    pdf.image(qr_code_png_io, x=630, y=50, w=100, h=100)
    pdf_data = io.BytesIO(bytes(pdf.output()))


    with open("ticket_template.pdf", "rb") as pdf_file:
        ticket_pdf = PdfReader(pdf_file)
        overlay_pdf = PdfReader(pdf_data)

        output = PdfWriter()
        page = ticket_pdf.pages[0]
        page.merge_page(overlay_pdf.pages[0])
        output.add_page(page)


    stream = io.BytesIO()
    output.write_stream(stream)
    with open("ticket.pdf", "wb") as pdf:
        pdf.write(stream.getvalue())

    return stream.getvalue()



def generate_ticket_pdf_portrait():
    validation_url = "http://www.scheppernaufbrettern.de"
    name = "Moritz"
    surname = "Leugers"
    order_id = "2024-001-X-XX"
    price = 50
    qr_code = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4
    )
    qr_code.add_data(validation_url)
    qr_code.make(fit=True)
    qr_code_img = qr_code.make_image(back_color="transparent")
    buffer = io.BytesIO()
    qr_code_img.save(buffer, format='PNG')
    qr_code_bytes = buffer.getvalue()

    pdf = FPDF("L", "mm", (315, 210))
    pdf.add_page()
    pdf.add_font("Jost", "", "Jost-SemiBold.ttf")
    pdf.set_font("Jost", "", size=25)
    pdf.set_fill_color(255,255,255)
    pdf.set_xy(18, 10)
    pdf.cell(30, 50, text="Moritz Simon von Langername Leugers")
    pdf.set_xy(18, 20)
    pdf.cell(30, 50, text=order_id)
    pdf.set_xy(18, 32.5)
    pdf.cell(30, 50, text="Helfer*in | Carpass")
    pdf.set_xy(18, 42.5)
    pdf.cell(30, 50, text="50€ inkl. Steuern und Camping")

    pdf.image(qr_code_bytes, x=5, y=65, w=200, h=200)
    pdf_data = io.BytesIO(bytes(pdf.output()))


    with open("ticket_portait.pdf", "rb") as pdf_file:
        ticket_pdf = PdfReader(pdf_file)
        overlay_pdf = PdfReader(pdf_data)

        output = PdfWriter()
        page = ticket_pdf.pages[0]
        page.merge_page(overlay_pdf.pages[0])
        output.add_page(page)


    stream = io.BytesIO()
    output.write_stream(stream)

    return stream.getvalue()




def test_on_call():
    import requests
    ticket_data = {
        'data': {
            "secretToken": "1tguIvhdA6Fr7d8bVhpf",
            "orderId": "2024-033-X-XX"
        }
    }
    headers={"content-type": "application/json"}
    ret = requests.post(url="https://get-tickets-with-order-id-xug24p2qva-ey.a.run.app", data=json.dumps(ticket_data), headers=headers)
    print(ret.text)

@firestore.transactional
def _tickets_available(transaction, tickets_collection_ref):
    query_filter = Or(filters=[FieldFilter("status", "==", "ordered"), FieldFilter("status", "==", "payed")])
    count_orders_query = tickets_collection_ref.where(filter=query_filter).count()
    amount_of_ticket_orders = count_orders_query.get(transaction=transaction)[0][0].value
    
    return amount_of_ticket_orders



if __name__ == "__main__":
    doc = generate_ticket_pdf_portrait()
    with open("doc_2.pdf", "wb") as d:
        d.write(doc)