import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import "./App.css";
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_51HbKSjIyjaakxrkQjbjVJGs84Dgag2crDKYtFITADCe33ZsyTyd0HZeqhSb8ceXeYdyJid3bmxvN35uxQdIBoOWb00aoV3vTkr");

const money = 5000;

const ProductDisplay = ({ handleClick }) => (
  <section>
    <div className="product">
      <img
        src="https://i.imgur.com/EHyR2nP.png"
        alt="The cover of Stubborn Attachments"
      />
      <div className="description">
        <h3>支払い金額</h3>
        <h5>￥{money}</h5>
      </div>
    </div>
    <button id="checkout-button" role="link" onClick={handleClick}>
      Checkout
    </button>
  </section>
);

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function App() {
  const [message, setMessage] = useState("");

//   useEffect(() => {
//     // Check to see if this is a redirect back from Checkout
//     const query = new URLSearchParams(window.location.search);

//     if (query.get("success")) {
//       setMessage("Order placed! You will receive an email confirmation.");
//     }

//     if (query.get("canceled")) {
//       setMessage(
//         "Order canceled -- continue to shop around and checkout when you're ready."
//       );
//     }
//   }, []);

  const handleClick = async (event) => {
    const stripe = await stripePromise;
    // const body="fdsafdsjakfldsjaflsdaf";
    // const obj2 = {hello: "world"};
    // const body2 = JSON.stringify(obj2);
    const obj2 =  {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'jpy',
              product_data: {
                name: '支払い金額',
                images: ['https://i.imgur.com/EHyR2nP.png'],
              },
              unit_amount: money,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
    
        // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
        // success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
        // cancel_url: `${domainURL}/canceled.html`,
        success_url: `https://www.codechrysalis.io/`,
        cancel_url: `https://google.co.jp`,
      }

      const body2 = JSON.stringify(obj2);

    const response = await fetch("/create-session", {
      method: "POST",
      headers: { 'Accept': 'application/json',
                 'Content-Type': 'application/json'
                },
      body: body2
    });

    const session = await response.json();
    console.log("sessionは何？", session);
    // When the customer clicks on the button, redirect them to Checkout.
    const result = await stripe.redirectToCheckout({
    //   sessionId: session.id,
        sessionId: session.sessionId,
    });

    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
    }
  };

  return message ? (
    <Message message={message} />
  ) : (
    <ProductDisplay handleClick={handleClick} />
  );
}
