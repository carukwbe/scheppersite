# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_admin import initialize_app

@https_fn.on_call()
def my_callable_function(data):
    input_data = data.data

    if input_data is not None:
        return f"{input_data.get('name')}"
    else:
        return {"error": "Invalid input"}