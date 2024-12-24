import express from "express";
import stripePackage from "stripe";
import RESPONSE from "../../../responseCodes.js";
import { configDotenv } from "dotenv";
configDotenv();

const router = express.Router();
const stripe = stripePackage(process.env.STRIPE_PRIVATE_KEY);
const ENDPOINT_SECRET = process.env.STRIPE_ENDPOINT_SECRET;

// Endpoint to handle Stripe webhooks
router.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    let event;

    try {
      const signature = req.headers["stripe-signature"];

      // Verify the Stripe webhook signature
      if (ENDPOINT_SECRET) {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          ENDPOINT_SECRET
        );
      } else {
        // Fallback to basic JSON parsing if no secret is provided
        event = JSON.parse(req.body);
      }

      // Handle different Stripe webhook event types
      switch (event.type) {
        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object;
          console.log(
            `PaymentIntent for ${paymentIntent.amount} was successful!`
          );
          // Implement your custom logic for successful payment intents here
          break;
        }
        case "payment_method.attached": {
          const paymentMethod = event.data.object;
          console.log(`PaymentMethod attached: ${paymentMethod.id}`);
          // Implement your custom logic for attached payment methods here
          break;
        }
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      // Send a 200 response to acknowledge receipt of the event
      res
        .status(RESPONSE.SUCCESS.OK.status)
        .json({ message: "Webhook handled successfully." });
    } catch (error) {
      console.error("Error handling webhook:", error.message);
      res
        .status(RESPONSE.ERROR.SERVER_ERROR.status)
        .json({ message: "Webhook handling failed." });
    }
  }
);

export default router;
