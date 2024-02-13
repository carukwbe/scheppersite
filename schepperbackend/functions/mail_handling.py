from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter

from PyPDF2 import PdfReader, PdfWriter
from fpdf import FPDF
from datetime import timedelta

import qrcode
import jinja2
from jinja2.sandbox import SandboxedEnvironment
import io
import base64

def generate_ticket_pdf(validation_url, name, surname, order_id, price):
    qr_code = qrcode.make(validation_url)
    # Neccessary to get qrcode as BytesIO in png format
    qr_code_io = io.BytesIO(qr_code.tobytes())
    qr_code.save(qr_code_io, "PNG")
    qr_code_io.seek(0)
    qr_code_png = qr_code_io.read()
    qr_code_png_io = io.BytesIO(qr_code_png)

    # Create empty PDF with personal info on ticket
    personal_info_pdf = FPDF("L", "mm", (400, 750))
    personal_info_pdf.add_page()
    personal_info_pdf.add_font("Jost", "", "Jost-SemiBold.ttf")
    personal_info_pdf.set_font("Jost", "", size=55)
    personal_info_pdf.set_xy(660, 200)
    personal_info_pdf.cell(30, 50, text=order_id)
    personal_info_pdf.set_xy(575, 321)
    personal_info_pdf.cell(30, 50, text=str(price))
    personal_info_pdf.set_font("Jost", "", size=55)
    personal_info_pdf.set_xy(25, 200)
    personal_info_pdf.cell(30, 50, text=f"{name} {surname}")
    personal_info_pdf.image(qr_code_png_io, x=630, y=50, w=100, h=100)
    personal_info_pdf_data = io.BytesIO(bytes(personal_info_pdf.output()))
    personal_info_pdf_reader = PdfReader(personal_info_pdf_data)

    with open("ticket_template.pdf", "rb") as pdf_file:
        ticket_template_pdf_reader = PdfReader(pdf_file)
        # Combine ticket template pdf with personal info pdf, pdf_file needs to remain opened.
        final_ticket = PdfWriter()
        final_ticket_page = ticket_template_pdf_reader.pages[0]
        final_ticket_page.merge_page(personal_info_pdf_reader.pages[0])
        final_ticket.add_page(final_ticket_page)

    output_stream = io.BytesIO()
    final_ticket.write_stream(output_stream)
    return output_stream.getvalue()


def generate_ticket_pdf_portrait(validation_url, name, surname, order_id, price, carpass, helper):  
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
    pdf.set_xy(18, 10)
    pdf.cell(30, 50, text=f"{name} {surname}")
    pdf.set_xy(18, 20)
    pdf.cell(30, 50, text=order_id)
    helper_carpass = [item for condition, item in [(helper, "HELFER*IN"), (carpass, "CARPASS")] if condition]
    pdf.set_xy(163, 20)
    pdf.cell(30, 50, text=f"{(' | '.join(helper_carpass))}", align="R")
    
    pdf.set_xy(18, 42.5)
    pdf.cell(30, 50, text=f"{'{:.2f}'.format(price).replace('.', ',')}€ inkl. Steuern und Camping")
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


def render_html_template(template_name, input_data):
    html_template_loader = jinja2.FileSystemLoader(searchpath="./mails_html")
    html_template_env = jinja2.Environment(loader=html_template_loader)
    html_template = html_template_env.get_template(template_name)
    return html_template.render(input_data)


def render_html_template_sandboxed(template_name, input_data):
    html_template_loader = jinja2.FileSystemLoader(searchpath="./mails_html")
    html_template_env = SandboxedEnvironment(loader=html_template_loader, autoescape=True)
    html_template = html_template_env.get_template(template_name)

    return html_template.render({**input_data})


def add_to_email_collection(recipient, subject, text, html, attachments):
    db = firestore.client()
    message = {
        "message": {
            "attachments": attachments,
            "text": text,
            "html": html,
            "subject": subject
        },
        "to": recipient
    }
    db.collection("mail").document().set(message)


def send_confirmation_mail(name, email, price, order_id):
    html_content = render_html_template_sandboxed("mail_order_confirm.html", {
        "year": 2024,
        "name": name, 
        "price": price,
        "verwendungszweck": order_id
    })
    
    add_to_email_collection(recipient=email, 
                            subject="Deine Bestellung ist eingegangen!",
                            text=None,
                            html=html_content,
                            attachments=None)
    

def send_ticket(ticket_id, name, surname, email, order_id, price, carpass, helper, secret) -> None:
    scanning_url = f"https://scheppernaufbrettern.de/scan_ticket/{ticket_id}"

    ticket_pdf = generate_ticket_pdf_portrait(scanning_url, name, surname, order_id, price, carpass, helper)#generate_ticket_pdf(scanning_url, name, surname, order_id, price)
    encoded_ticket_pdf = base64.b64encode(ticket_pdf).decode('utf-8')
    
    html_template_filename = "mail_ticket_secret.html" if secret else "mail_ticket.html"
    html_content = render_html_template_sandboxed(html_template_filename, {
        "year": 2024,
        "name": name, 
        "ticket_ID": ticket_id,
        "price": price
    })
    add_to_email_collection(recipient=email, 
                            subject="Dein Ticket ist da!",
                            text=None,
                            html=html_content,
                            attachments={
                                "content": encoded_ticket_pdf,
                                "encoding": "base64",
                                "filename": f"ticket_{order_id}.pdf",
    })

def send_regular_ticket(ticket_id, name, surname, email, order_id, price, carpass, helper) -> None:
    send_ticket(ticket_id, name, surname, email, order_id, price, carpass, helper, secret=False)


def send_secret_ticket(ticket_id, name, surname, email, order_id, price, carpass, helper) -> None:
    send_ticket(ticket_id, name, surname, email, order_id, price, carpass, helper, secret=True)


def send_validation_mail(ticket_id, name, email, secret):
    html_template_filename = "mail_validate_secret.html" if secret else "mail_repersonalization_validate.html"
    mail_subject = ("Du hast ein Ticket für das Scheppern auf Brettern 2024 erhalten!" if secret else
                  "Ein Ticket für das Scheppern auf Brettern 2024 wurde auf dich übertragen!")
    
    html_content = render_html_template_sandboxed(html_template_filename, {
        "year": 2024,
        "name": name, 
        "ticket_ID": ticket_id
    })
    add_to_email_collection(recipient=email, 
                            subject=mail_subject,
                            text=None,
                            html=html_content,
                            attachments=None)

def send_secret_ticket_validation_mail(ticket_id, name, email):
    send_validation_mail(ticket_id, name, email, secret=True)

def send_repersonalization_validation_mail(ticket_id, name, email):
    send_validation_mail(ticket_id, name, email, secret=False)


def send_repersonalization_origin_mail(ticket_id, name, email):
    html_content = render_html_template_sandboxed("mail_repersonalization_origin.html", {
        "name": name,
        "ticket_ID": ticket_id
    })
    add_to_email_collection(recipient=email, 
                            subject="Du hast eine Weitergabe deines Tickets für das Scheppern auf Brettern 2024 gestartet",
                            text=None,
                            html=html_content,
                            attachments=None)
    

def send_repersonalization_origin_success_mail(name, email):
    html_content = render_html_template_sandboxed("mail_repersonalization_origin_success.html", {
        "year": 2024, 
        "name": name,
    })
    add_to_email_collection(recipient=email, 
                            subject="Die Weitergabe deines Tickets für das Scheppern auf Brettern 2024 ist abgeschlossen",
                            text=None,
                            html=html_content,
                            attachments=None)


def send_payment_reminder(name, email, price, order_id, order_date, days_until_deletion, ticket_id):
    expired_datetime = order_date + timedelta(days=days_until_deletion)
    html_content = render_html_template_sandboxed("mail_order_confirm_reminder.html", {
        "year": 2024,
        "name": name, 
        "price": price,
        "expired_date": expired_datetime.date().strftime("%d.%m.%Y"),
        "ticket_ID": ticket_id,
        "verwendungszweck": order_id
    })
    add_to_email_collection(recipient=[email], 
                            subject="Ernnerung: Nicht vergessen, dein Ticket zu bezahlen!",
                            text=None,
                            html=html_content,
                            attachments=None)


def send_order_deletion_mail(name, email, ticket_id):
    html_content = render_html_template("mail_order_deletion.html", {
        "name": name, 
        "ticket_ID": ticket_id 
    })
    add_to_email_collection(recipient=[email], 
                            subject="Deine Ticketbestellung für das Scheppern auf Brettern 2024 wurde storniert!",
                            text=None,
                            html=html_content,
                            attachments=None)
    


def send_mail_on_faulty_transaction(document_id):
    add_to_email_collection(recipient=[""], 
                            subject="Es wurde eine möglicherweise fehlerhafte Überweisung im Ticketsystem erkannt!",
                            text="Hi Admins, schaut euch das mal an!",
                            html=None,
                            attachments=None)
    

    
def send_mail_on_contact_form_message(sender_email, telephone, ticket_id, message):
    mail_text = (f"Von: \t {sender_email}\n"
                 f"Telefon: \t{telephone}\n"
                 f"Ticket ID: \t{ticket_id}\n\n")
    add_to_email_collection(recipient=[""], 
                            subject="Neue Nachricht über das Kontaktformular!",
                            text=mail_text,
                            html=None,
                            attachments=None)