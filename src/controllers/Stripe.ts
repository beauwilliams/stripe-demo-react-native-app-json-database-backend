import { IncomingMessage, ServerResponse } from "http";
import Stripe from "stripe";

require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_API_KEY || "", {
  apiVersion: "2022-08-01",
  typescript: true,
});

export const createPaymentIntent = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const paymentIntent = await stripe.paymentIntents
    .create({
      amount: 4242,
      currency: "aud",
    })
    .then((paymentIntent) => {
      res.end(
        JSON.stringify({
          clientSecret: paymentIntent.client_secret,
        })
      );
    })
    .catch((error) => {
      return console.log(error);
    });
};
