import os
from typing import Union
from firebase_functions import https_fn, params
from firebase_admin import firestore, initialize_app
import datetime

initialize_app(
    options={
        'projectId': 'scheppersite',
        'databaseURL': 'http://127.0.0.1:4000'  # Firestore emulator runs on this URL
    }
)
os.environ["PROJECT_ID"] = params.PROJECT_ID.value
TICKETS_COLLECTION_NAME = "tickets"

@https_fn.on_call(region='europe-west3', concurrency=1, max_instances=1, cpu="gcf_gen1", memory=256)
def log_headers(req: https_fn.CallableRequest) -> Union[str, https_fn.Response]:
    db = firestore.client()

    data = dict(req.raw_request.headers)
    data.update(req.data)

    # Add CORS headers
    headers = {
        'Access-Control-Allow-Origin': 'https://scheppernaufbrettern.de',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }

    # Check if the request is an OPTIONS preflight request and return early
    if req.method == 'OPTIONS':
        return https_fn.Response(status=204, headers=headers)

    # todo: strip unnecessary data from headers after analysis of data

    now = datetime.datetime.now().strftime("%Y-%m-%d_%H:%M:%S:%f")
    db.collection('http_logs').document(now).set(data)
    return https_fn.Response('Headers saved successfully!', headers=headers)
