# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_admin import initialize_app, firestore


from firebase_functions.firestore_fn import (
  on_document_updated,
  on_document_created,
  Event,
  Change,
  DocumentSnapshot,
)

initialize_app()

@https_fn.on_call()
def test_backend_communication(req: https_fn.CallableRequest):
    return {"text": req.data["text"]}
