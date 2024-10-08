import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import RESPONSE from "../../responseCodes.js";
import { sendVerificationEmail } from "../../utils/sendUserVerificationEmail.js";

const router = express.Router();
const User = mongoose.model("User");
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const oldUser = await User.findOne({ email });
  if (!oldUser) {
    return res
      .status(RESPONSE.ERROR.NOT_FOUND.status)
      .json({ message: "Please register before you login!" });
  }

  // Check if the user is verified
  if (!oldUser.isVerified) {
    const { verificationCode, verificationCodeExpires } =
      await sendVerificationEmail(email); // Await the email sending

    // Update user with new verification details
    oldUser.verificationCode = verificationCode;
    oldUser.verificationCodeExpires = verificationCodeExpires;

    await oldUser.save();

    const { status, message } = RESPONSE.ERROR.EMAIL_NOT_VERIFIED;
    return res.status(status).json({
      message,
      resendVerification: true,
    });
  }

  const isPasswordMatch = await bcrypt.compare(password, oldUser.password);
  if (isPasswordMatch) {
    try {
      const token = jwt.sign(
        { email: oldUser.email, name: oldUser.name },
        JWT_SECRET
      );
      return res
        .status(RESPONSE.SUCCESS.OK.status)
        .json({ token, message: "Login successful!" });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return res
        .status(RESPONSE.ERROR.SERVER_ERROR.status)
        .json({ message: RESPONSE.ERROR.SERVER_ERROR.message });
    }
  } else {
    const { status, message } = RESPONSE.ERROR.INVALID_CREDENTIALS;
    return res.status(status).json({ message });
  }
});

export default router;
