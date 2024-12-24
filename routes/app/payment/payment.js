import express from "express";
import stripePay from "stripe";
import { configDotenv } from "dotenv";

const router = express.Router();
configDotenv();
// const stripe = require("stripe")(
//   "sk_test_51QYUh7G2QuAAIuzLSgAdxiuCku23xqJir79YrlcOC77nR0LwtUo2Dd5GAYy7Q2YZkRCWHUROl9HjFjgfKZ2A535L00wuibRIBM"
// );
// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

const stripe = stripePay(process.env.STRIPE_PRIVATE_KEY);
router.post("/payment-sheet", async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2024-12-18.acacia" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: "cad",
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: process.env.STRIPE_PUBLIC_KEY,
  });
});

export default router;
