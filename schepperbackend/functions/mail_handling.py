from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter

from PyPDF2 import PdfReader, PdfWriter
from fpdf import FPDF

import qrcode
import jinja2
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
    personal_info_pdf.set_fill_color(255,255,255)
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


def render_html_template(template_name, input_data):
    html_template_loader = jinja2.FileSystemLoader(searchpath="./mails_html")
    html_template_env = jinja2.Environment(loader=html_template_loader)
    html_template = html_template_env.get_template(template_name)
    return html_template.render(input_data)


def send_confirmation_mail(name, email, price):
    html_content = render_html_template("confirmation_mail.html", {
        "name": name, 
        "price": price 
    })
    add_to_email_collection(recipient=email, 
                            subject="Deine Bestellung ist eingegangen!",
                            text=None,
                            html=html_content,
                            attachments=None)
    

def send_ticket(ticket_id, name, surname, email, order_id, price) -> None:
    validation_url = f"http://?{ticket_id}"
    repersonalization_url = f"https://{ticket_id}"

    ticket_pdf = generate_ticket_pdf(validation_url, name, surname, order_id, price)
    encoded_ticket_pdf = base64.b64encode(ticket_pdf).decode('utf-8')
    
    html_content = render_html_template("ticket_sending_mail.html", {
        "name": name, 
        "price": price,
        "repersonalization_url": repersonalization_url
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


def send_repersonalization_mail(ticket_id, old_name, new_name, email):
    acceptance_link = f"https://{ticket_id}"
    html_content = render_html_template("repersonalization_mail.html", {
        "old_name": old_name, 
        "new_name": new_name,
        "acceptance_link": acceptance_link
    })
    add_to_email_collection(recipient=email, 
                            subject="Ein Ticket für das Scheppern auf Brettern 2024 wurde auf dich übertragen!",
                            text=None,
                            html=html_content,
                            attachments=None)