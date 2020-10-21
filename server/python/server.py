#! /usr/bin/env python3.6

"""
server.py
Stripe Sample.
Python 3.6 or newer required.
"""

import stripe
import json
import os

from flask import Flask, render_template, jsonify, request, send_from_directory
from dotenv import load_dotenv, find_dotenv
from flask_json import FlaskJSON, JsonError, json_response, as_json

# Setup Stripe python client library
load_dotenv(find_dotenv())
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
stripe.api_version = os.getenv('STRIPE_API_VERSION')

static_dir = str(os.path.abspath(os.path.join(
    __file__, "..", os.getenv("STATIC_DIR"))))
app = Flask(__name__, static_folder=static_dir,
            static_url_path="", template_folder=static_dir)

# @app.route('/', methods=['GET'])
# def get_example():
#     return render_template('index.html')


# @app.route('/config', methods=['GET'])
# def get_publishable_key():
#     price = stripe.Price.retrieve(os.getenv('PRICE'))
#     return jsonify({
#       'publicKey': os.getenv('STRIPE_PUBLISHABLE_KEY'),
#       'unitAmount': price['unit_amount'],
#       'currency': price['currency']
#     })

# Fetch the Checkout Session to display the JSON result on the success page
# @app.route('/checkout-session', methods=['GET'])
# def get_checkout_session():
#     id = request.args.get('sessionId')
#     checkout_session = stripe.checkout.Session.retrieve(id)
#     return jsonify(checkout_session)


@app.route('/create-session', methods=['POST'])
def create_checkout_session():
    print(request)
    data = json.loads(request.data)
    domain_url = os.getenv('DOMAIN')
    print("tadamon")
    print(data['payment_method_types'])
    print(data['line_items'])
    print(data['mode'])
    print(data['success_url'])
    print(data['cancel_url'])

    try:
        # Create new Checkout Session for the order
        # Other optional params include:
        # [billing_address_collection] - to display billing address details on the page
        # [customer] - if you have an existing Stripe Customer ID
        # [payment_intent_data] - lets capture the payment later
        # [customer_email] - lets you prefill the email input in the form
        # For full details see https:#stripe.com/docs/api/checkout/sessions/create
        
        # ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
        checkout_session = stripe.checkout.Session.create(
            # success_url=domain_url +
            # "/success.html?session_id={CHECKOUT_SESSION_ID}",
            # cancel_url=domain_url + "/canceled.html",
            success_url=data['success_url'],
            cancel_url=data['cancel_url'],
            payment_method_types=data["payment_method_types"],
            mode=data['mode'],
            line_items=data['line_items']
        )

        print("create checkout_sessionは抜けているぞ！！")
        print({'sessionId': checkout_session['id']})
        return jsonify({'sessionId': checkout_session['id']})
        # return json_response({'sessionId': checkout_session['id']})
    except Exception as e:
        return JsonError(error=str(e)), 403


# create ephemeralKeys
@app.route('/ephemeral_keys', methods=['POST'])
def create_ephemeralKeys():
    print("ここはephemeralKeysです")

    try:
        # ref<https://kumano-te.com/activities/implement-stripe-subscription-with-python>
        #stripe_customer = stripe.Customer.create(email= "tdtk1538@gmail.com",name="tadamon")
        # stripe_customer = stripe.Customer.create(email= "tdtk1538@gmail.com")
        # customerId = stripe_customer["id"]
        data = json.loads(request.data)
        customerId=data["customerId"]
        apiVersion=data["api_version"]
        print(customerId)
        print(apiVersion)
        print(stripe.api_version)
        key = stripe.EphemeralKey.create(
            customer=customerId,
            stripe_version=apiVersion,
            # customer='cus_IEzvx44Lr8rqcC',
            # stripe_version='2020-08-27',
        )
        # key = stripe.EphemeralKey.create(customer=customerId, stripe_version=apiVersion)
        print(key)

        print("create-ephemeralKeysは抜けているぞ！！")
        # 取り方を考える
        return jsonify(key)
        # return JsonResponse('key': key)
    except Exception as e:
        return JsonError(error=str(e)), 403

# @app.route('/webhook', methods=['POST'])
# def webhook_received():
#     # You can use webhooks to receive information about asynchronous payment events.
#     # For more about our webhook events check out https://stripe.com/docs/webhooks.
#     webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
#     request_data = json.loads(request.data)

#     if webhook_secret:
#         # Retrieve the event by verifying the signature using the raw body and secret if webhook signing is configured.
#         signature = request.headers.get('stripe-signature')
#         try:
#             event = stripe.Webhook.construct_event(
#                 payload=request.data, sig_header=signature, secret=webhook_secret)
#             data = event['data']
#         except Exception as e:
#             return e
#         # Get the type of webhook event sent - used to check the status of PaymentIntents.
#         event_type = event['type']
#     else:
#         data = request_data['data']
#         event_type = request_data['type']
#     data_object = data['object']

#     print('event ' + event_type)

    if event_type == 'checkout.session.completed':
        print('🔔 Payment succeeded!')

    return jsonify({'status': 'success'})


if __name__ == '__main__':
    app.run(port=4242)
