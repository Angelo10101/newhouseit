# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_functions.options import set_global_options
from firebase_admin import initialize_app
import requests
import os
import json

# For cost control, you can set the maximum number of containers that can be
# running at the same time. This helps mitigate the impact of unexpected
# traffic spikes by instead downgrading performance. This limit is a per-function
# limit. You can override the limit for each function using the max_instances
# parameter in the decorator, e.g. @https_fn.on_request(max_instances=5).
set_global_options(max_instances=10)

initialize_app()

# Paystack Secret Key - Should be set as an environment variable
# Set this using: firebase functions:config:set paystack.secret_key="your_secret_key"
PAYSTACK_SECRET_KEY = os.environ.get('PAYSTACK_SECRET_KEY')

@https_fn.on_call()
def initiatePayment(req: https_fn.CallableRequest) -> dict:
    """
    Initialize a Paystack payment transaction.
    
    Args:
        req.data should contain:
        - email: User's email address
        - amount: Amount in kobo (multiply rand by 100)
        - metadata: Optional metadata object
    
    Returns:
        dict with:
        - success: boolean
        - authorization_url: Paystack checkout URL
        - access_code: Access code for the transaction
        - reference: Transaction reference
        - error: Error message if failed
    """
    try:
        # Validate input
        if not req.data:
            raise https_fn.HttpsError(
                code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
                message="Request data is required"
            )
        
        email = req.data.get('email')
        amount = req.data.get('amount')
        
        if not email:
            raise https_fn.HttpsError(
                code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
                message="Email is required"
            )
        
        if not amount or not isinstance(amount, (int, float)) or amount <= 0:
            raise https_fn.HttpsError(
                code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
                message="Valid amount is required"
            )
        
        if not PAYSTACK_SECRET_KEY:
            raise https_fn.HttpsError(
                code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
                message="Paystack secret key not configured"
            )
        
        # Prepare the request to Paystack
        url = "https://api.paystack.co/transaction/initialize"
        headers = {
            "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        
        # Convert amount to kobo (Paystack uses smallest currency unit)
        amount_in_kobo = int(amount * 100)
        
        payload = {
            "email": email,
            "amount": amount_in_kobo,
            "currency": "ZAR",  # South African Rand
            "callback_url": req.data.get('callback_url', ''),
            "metadata": req.data.get('metadata', {})
        }
        
        # Make request to Paystack
        response = requests.post(url, json=payload, headers=headers)
        response_data = response.json()
        
        if response.status_code == 200 and response_data.get('status'):
            # Success
            data = response_data.get('data', {})
            return {
                "success": True,
                "authorization_url": data.get('authorization_url'),
                "access_code": data.get('access_code'),
                "reference": data.get('reference')
            }
        else:
            # Paystack API error
            error_message = response_data.get('message', 'Failed to initialize payment')
            raise https_fn.HttpsError(
                code=https_fn.FunctionsErrorCode.INTERNAL,
                message=f"Paystack error: {error_message}"
            )
    
    except https_fn.HttpsError:
        # Re-raise HttpsError as-is
        raise
    except Exception as e:
        # Catch any other errors
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INTERNAL,
            message=f"Error initializing payment: {str(e)}"
        )


@https_fn.on_call()
def verifyPayment(req: https_fn.CallableRequest) -> dict:
    """
    Verify a Paystack payment transaction.
    
    Args:
        req.data should contain:
        - reference: Transaction reference to verify
    
    Returns:
        dict with:
        - success: boolean
        - status: Transaction status
        - amount: Transaction amount
        - metadata: Transaction metadata
        - error: Error message if failed
    """
    try:
        # Validate input
        if not req.data:
            raise https_fn.HttpsError(
                code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
                message="Request data is required"
            )
        
        reference = req.data.get('reference')
        
        if not reference:
            raise https_fn.HttpsError(
                code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
                message="Transaction reference is required"
            )
        
        if not PAYSTACK_SECRET_KEY:
            raise https_fn.HttpsError(
                code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
                message="Paystack secret key not configured"
            )
        
        # Verify transaction with Paystack
        url = f"https://api.paystack.co/transaction/verify/{reference}"
        headers = {
            "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(url, headers=headers)
        response_data = response.json()
        
        if response.status_code == 200 and response_data.get('status'):
            # Success
            data = response_data.get('data', {})
            return {
                "success": True,
                "status": data.get('status'),
                "amount": data.get('amount', 0) / 100,  # Convert from kobo to rand
                "reference": data.get('reference'),
                "metadata": data.get('metadata', {})
            }
        else:
            # Paystack API error
            error_message = response_data.get('message', 'Failed to verify payment')
            raise https_fn.HttpsError(
                code=https_fn.FunctionsErrorCode.INTERNAL,
                message=f"Paystack error: {error_message}"
            )
    
    except https_fn.HttpsError:
        # Re-raise HttpsError as-is
        raise
    except Exception as e:
        # Catch any other errors
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INTERNAL,
            message=f"Error verifying payment: {str(e)}"
        )