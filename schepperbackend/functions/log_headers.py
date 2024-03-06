import os
from typing import Union

from firebase_functions import https_fn, params
from firebase_admin import firestore, initialize_app

import datetime

initialize_app(
    options = {
        'projectId': 'scheppersite',
        'databaseURL': 'http://127.0.0.1:4000'  # Firestore emulator runs on this URL
    }
)
os.environ["PROJECT_ID"] = params.PROJECT_ID.value
TICKETS_COLLECTION_NAME = "tickets"

@https_fn.on_call(region='europe-west3')
def log_headers(req: https_fn.CallableRequest) -> Union[str, https_fn.Response]:
    db = firestore.client()

    data = dict(req.raw_request.headers)
    data.update(req.data)

    # todo: strip unnecessary data from headers after analysis of data

    now = datetime.datetime.now().strftime("%Y-%m-%d_%H:%M:%S:%f")
    db.collection('http_logs').document(now).set(data)
    return 'Headers saved successfully!'