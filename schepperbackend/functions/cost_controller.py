import os
import json
import traceback

from googleapiclient import discovery


def review_billing_event(billing_event_data_json):
    cost_amount = billing_event_data_json["costAmount"]
    budget_amount = billing_event_data_json["budgetAmount"]
    if cost_amount <= budget_amount:
        print(f"No action necessary. (Current cost: {cost_amount})")
    else:
        stop_billing()


def stop_billing():
    PROJECT_ID = os.getenv("PROJECT_ID")
    PROJECT_NAME = f"projects/{PROJECT_ID}"

    if PROJECT_ID is None:
        print("No project specified with environment variable")
        return

    billing = discovery.build(
        "cloudbilling",
        "v1",
        cache_discovery=False,
    )
    projects = billing.projects()
    billing_enabled = __is_billing_enabled(PROJECT_NAME, projects)
    if billing_enabled:
        __disable_billing_for_project(PROJECT_NAME, projects)
    else:
        print("Billing already disabled")


def __is_billing_enabled(project_name, projects):
    """
    Determine whether billing is enabled for a project
    @param {string} project_name Name of project to check if billing is enabled
    @return {bool} Whether project has billing enabled or not
    """
    try:
        res = projects.getBillingInfo(name=project_name).execute()
        return res["billingEnabled"]
    except KeyError:
        # If billingEnabled isn't part of the return, billing is not enabled
        return False
    except Exception:
        print(
            "Unable to determine if billing is enabled on specified project, assuming billing is enabled"
        )
        return True


def __disable_billing_for_project(project_name, projects):
    """
    Disable billing for a project by removing its billing account
    @param {string} project_name Name of project disable billing on
    """
    body = {"billingAccountName": ""}  # Disable billing
    try:
        res = projects.updateBillingInfo(name=project_name, body=body).execute()
        print(f"Billing disabled: {json.dumps(res)}")
    except Exception as e:
        print(traceback.format_exc(e))