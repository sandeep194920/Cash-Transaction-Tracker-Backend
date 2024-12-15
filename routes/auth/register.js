import express from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import RESPONSE from "../../responseCodes.js";
import { sendVerificationEmail } from "../../utils/sendUserVerificationEmail.js";

const router = express.Router();
const User = mongoose.model("User");

router.post("/register-user", async (req, res) => {
  console.log("/register route");
  const { name, email, password } = req.body;

  const oldUser = await User.findOne({ email });
  if (oldUser) {
    if (oldUser.isVerified) {
      return res.status(RESPONSE.ERROR.USER_EXISTS.status).json({
        message: "User already exists! Please login.",
        error_code: "USER_VERIFIED",
      });
    } else {
      return res.status(RESPONSE.ERROR.USER_EXISTS.status).json({
        message: "User already exists but not verified! Please verify.",
        error_code: "USER_NOT_VERIFIED",
      });
    }
  }

  let newUser; // Declare newUser outside try-catch
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Send verification email and get verification details
    const { verificationCode, verificationCodeExpires } =
      await sendVerificationEmail({ email, name });

    // Create the new user
    newUser = await User.create({
      name,
      email,
      password: encryptedPassword,
      verificationCode,
      verificationCodeExpires,
      // isVerified:false // by default specified in schema so no need here
    });

    // Respond to the client
    return res
      .status(RESPONSE.SUCCESS.CREATED.status)
      .json({ message: "User registered successfully!" });
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
