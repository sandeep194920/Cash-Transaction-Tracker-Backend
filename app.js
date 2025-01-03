import express from "express";
import mongoose from "mongoose";
import "./modals/User.js";
import "./modals/Customer.js";
import "./modals/Transaction.js";
import dotenv from "dotenv";

// Import routes
import registerRoute from "./routes/auth/register.js";
import verifyEmail from "./routes/auth/verifyEmail.js";
import resendVerificationEmail from "./routes/auth/resendVerificationEmail.js";
import loginRoute from "./routes/auth/login.js";
import userDataRoute from "./routes/auth/userData.js";
import creatCustomer from "./routes/app/createCustomers.js";
import updateCustomer from "./routes/app/updateCustomer.js";
import getCustomer from "./routes/app/getCustomer.js";
import getAllCustomers from "./routes/app/getAllCustomers.js";
import getCustomerTransactions from "./routes/app/getCustomerTransactions.js";
import creatTransaction from "./routes/app/createTransaction.js";
import getTransaction from "./routes/app/getTransaction.js";
import payment from "./routes/app/payment/payment.js";
import postPaymentWebhook from "./routes/app/payment/postPaymentWebhook.js";
import updateCustomerBalance from "./routes/app/updateCustomerBalance.js";
import testRoute from "./routes/test.js";

dotenv.config();

const app = express();

// const mongoURL = process.env.DB_CONNECTION_STR;

let mongoURL;

if (process.env.ENV === "PROD") {
  mongoURL = process.env.PROD_DB_CONNECTION_STR;
} else {
  mongoURL = process.env.TEST_DB_CONNECTION_STR;
}

mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((error) => console.log(error));

// Match the raw body to content type application/json
// If you are using Express v4 - v4.16 you need to use body-parser, not express, to retrieve the request body

// This example uses Express to receive webhooks

// Match the raw body to content type application/json
// If you are using Express v4 - v4.16 you need to use body-parser, not express, to retrieve the request body
app.post(
  "/api/stripe-webhook",
  express.json({ type: "application/json" }),
  (request, response) => {
    const event = request.body;

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);

        console.log("Payment Intent succeeded", paymentIntent);
        break;
      }
      case "payment_method.attached": {
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);

        console.log("Payment Method succeeded", paymentMethod);

        break;
      }
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    return response.json({ received: true });
  }
);

// Middleware to parse JSON request bodies
app.use(express.json());

// ROUTES
app.use("/api", testRoute);

// Auth Routes
app.use("/api", registerRoute);
app.use("/api", verifyEmail);
app.use("/api", resendVerificationEmail);
app.use("/api", loginRoute);
app.use("/api", userDataRoute);

// Customer Routes
app.use("/api", creatCustomer);
app.use("/api", updateCustomer);
app.use("/api", getAllCustomers);
app.use("/api", getCustomer);
app.use("/api", getCustomerTransactions);
app.use("/api", updateCustomerBalance);

// Transaction Routes
app.use("/api", getTransaction);
app.use("/api", creatTransaction);
// app.use("/api", getAllTransactions);

// Payment
app.use("/api", payment);

// // for stripe - post payment webhook
// app.use("/api", postPaymentWebhook);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
