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
import updateCustomerBalance from "./routes/app/updateCustomerBalance.js";
import testRoute from "./routes/test.js";

dotenv.config();

const app = express();

const mongoURL = process.env.DB_CONNECTION_STR;

mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((error) => console.log(error));

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

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
