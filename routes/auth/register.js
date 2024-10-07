import express from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import RESPONSE from "../../responseCodes.js";
import { sendVerificationEmail } from "../../utils/sendUserVerificationEmail.js";

const router = express.Router();
const User = mongoose.model("User");

router.post("/register-user", async (req, res) => {
  const { name, email, password } = req.body;

  const oldUser = await User.findOne({ email });
  if (oldUser) {
    return res
      .status(RESPONSE.ERROR.USER_EXISTS.status)
      .json({ message: "User already exists!" });
  }

  let newUser; // Declare newUser outside try-catch
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Send verification email and get verification details
    const { verificationCode, verificationCodeExpires } =
      await sendVerificationEmail(email); // Await sending the email

    // Create the new user
    newUser = await User.create({
      name,
      email,
      password: encryptedPassword,
      verificationCode,
      verificationCodeExpires,
    });

    // Respond to the client
    return res
      .status(RESPONSE.SUCCESS.CREATED.status)
      .json({ status: "ok", message: "User registered successfully!" });
  } catch (error) {
    console.error("Error during registration:", error);

    // If user was created but there's an error afterwards, delete the user
    if (newUser) {
      await User.deleteOne({ email }); // Delete the user by email
    }

    return res
      .status(RESPONSE.ERROR.SERVER_ERROR.status)
      .json({ status: "error", message: "Server error during registration." });
  }
});

export default router;
