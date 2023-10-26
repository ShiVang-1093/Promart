import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useSelector } from 'react-redux';

import CheckoutForm from "./CheckoutForm";
import "../Stripe.css";
import { selectCurrentOrder } from "../features/order/orderSlice";

const stripePromise = loadStripe("pk_test_51Nt98rSEBkp1UHxkhufxrvhlBslTKRTZiyFBsmKWOrSunmmynOTCgEqdvnVcKXDl06NLpdnjGdJ8WnC0gaMI5eoW00beiFY5oS");

export default function StripeCheckout() {
  const [clientSecret, setClientSecret] = useState("");
  const currentOrder = useSelector(selectCurrentOrder);

  useEffect(() => {
    // Check if currentOrder is defined before making the API request
    if (currentOrder) {
      fetch("/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalAmount: currentOrder.totalAmount, orderId: currentOrder.id }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }
  }, [currentOrder]); // Add currentOrder as a dependency

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="Stripe">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
