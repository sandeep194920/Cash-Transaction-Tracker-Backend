import express from "express";
import mongoose from "mongoose";
import RESPONSE from "../../responseCodes.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const User = mongoose.model("User");
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/verify-email", async (req, res) => {
  const { email, verificationCode } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(RESPONSE.ERROR.NOT_FOUND.status)
      .json({ message: "User not found!" });
  }

  // Check if the verification code matches and is not expired
  if (
    user.verificationCode === verificationCode &&
    user.verificationCodeExpires > Date.now()
  ) {
    user.isVerified = true; // Mark user as verified
    user.verificationCode = undefined; // Clear the code
    user.verificationCodeExpires = undefined;
    await user.save();

    const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET);
    return res
      .status(RESPONSE.SUCCESS.OK.status)
      .json({ token, message: "Email verified successfully!" });
  } else {
    return res.status(RESPONSE.ERROR.INVALID_CREDENTIALS.status).json({
      message: "Invalid or expired verification code.",
    });
  }
});

export default router;
