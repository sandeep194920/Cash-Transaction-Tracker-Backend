import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "./UserDetails.js";
import dotenv from "dotenv";
import RESPONSE from "./responseCodes.js"; // Import response codes
dotenv.config();

const app = express();

const mongoURL = process.env.DB_CONNECTION_STR;
const JWT_SECRET = process.env.JWT_SECRET;

mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((error) => console.log(error));

// Middleware to parse JSON request bodies
app.use(express.json());

const User = mongoose.model("User");

app.get("/", (req, res) => {
  return res
    .status(RESPONSE.SUCCESS.OK.status)
    .json({ data: RESPONSE.SUCCESS.OK.message });
});

app.post("/register-user", async (req, res) => {
  const { name, email, password } = req.body;

  const oldUser = await User.findOne({ email });
  if (oldUser) {
    return res
      .status(RESPONSE.ERROR.USER_EXISTS.status)
      .json({ message: "Registration successful!" });
  }

  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: encryptedPassword });
    return res
      .status(RESPONSE.SUCCESS.CREATED.status)
      .json({ status: "ok", message: RESPONSE.SUCCESS.CREATED.message });
  } catch (error) {
    return res
      .status(RESPONSE.ERROR.SERVER_ERROR.status)
      .json({ status: "error", message: RESPONSE.ERROR.SERVER_ERROR.message });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  const oldUser = await User.findOne({ email });
  if (!oldUser) {
    console.log("oldUser", oldUser, "not found in db");
    return res
      .status(RESPONSE.ERROR.NOT_FOUND.status)
      .json({ message: RESPONSE.ERROR.NOT_FOUND.message });
  }

  const isPasswordMatch = await bcrypt.compare(password, oldUser.password);
  if (isPasswordMatch) {
    try {
      const token = await jwt.sign({ email: oldUser.email }, JWT_SECRET);
      return res
        .status(RESPONSE.SUCCESS.OK.status)
        .json({ status: "ok", token, message: "Welcome back!" });
    } catch (error) {
      return res
        .status(RESPONSE.ERROR.SERVER_ERROR.status)
        .json({ message: RESPONSE.ERROR.SERVER_ERROR.message });
    }
  } else {
    return res
      .status(RESPONSE.ERROR.INVALID_CREDENTIALS.status)
      .json({ message: RESPONSE.ERROR.INVALID_CREDENTIALS.message });
  }
});

app.post("/user-data", async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email;

    const user = await User.findOne({ email: userEmail });
    if (user) {
      return res
        .status(RESPONSE.SUCCESS.OK.status)
        .json({ status: "ok", data: user });
    } else {
      return res
        .status(RESPONSE.ERROR.NOT_FOUND.status)
        .json({ message: RESPONSE.ERROR.NOT_FOUND.message });
    }
  } catch (error) {
    return res
      .status(RESPONSE.ERROR.INVALID_TOKEN.status)
      .json({ message: RESPONSE.ERROR.INVALID_TOKEN.message });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
