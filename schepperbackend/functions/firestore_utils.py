from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter

from PyPDF2 import PdfReader, PdfWriter
from fpdf import FPDF

import qrcode
import jinja2
import io
import base64

def get_field_value_of_all_documents(collection_name, field_name):
    all_fields = []
    db = firestore.client()
    all_documents_in_collection = db.collection(collection_name).stream()
    for doc in all_documents_in_collection:
        doc_dict = doc.to_dict()
        try:
            field_value = doc_dict[field_name]
        except KeyError:
            print(f"Value of field \"{field_name}\" in document with ID \"{doc.id}\" in collection \"{collection_name}\"" +
                  "does not exist!")
        if (field_value != "") and (field_value is not None):
            all_fields.append(field_value)
        else:
            print(f"Value of field \"{field_name}\" in document with ID \"{doc.id}\" in collection \"{collection_name}\"" +
                  "is empty!")

    return all_fields

