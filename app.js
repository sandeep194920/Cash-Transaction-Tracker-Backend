/* eslint-disable no-undef */
import express from "express";
import mongoose from "mongoose";
import "./UserDetails.js";
import dotenv from "dotenv";

// Import routes
import registerRoute from "./routes/auth/register.js";
import verifyEmail from "./routes/auth/verifyEmail.js";
import resendVerificationEmail from "./routes/auth/resendVerificationEmail.js";
import loginRoute from "./routes/auth/login.js";
import userDataRoute from "./routes/auth/userData.js";
import testRoute from "./routes/test.js";

dotenv.config();

const app = express();

// eslint-disable-next-line no-undef
const mongoURL = process.env.DB_CONNECTION_STR;

mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((error) => console.log(error));

// Middleware to parse JSON request bodies
app.use(express.json());

// Use the routes
app.use("/api", testRoute);
app.use("/api", registerRoute);
app.use("/api", verifyEmail);
app.use("/api", resendVerificationEmail);
app.use("/api", loginRoute);
app.use("/api", userDataRoute);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
