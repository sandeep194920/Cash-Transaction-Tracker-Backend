import express from "express";
import mongoose from "mongoose";
import RESPONSE from "../../responseCodes.js";
import { sendVerificationEmail } from "../../utils/sendUserVerificationEmail.js";

const router = express.Router();
const User = mongoose.model("User");

router.post("/resend-verification", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(RESPONSE.ERROR.NOT_FOUND.status)
      .json({ message: "User not found!" });
  }

  // Check if the user is already verified
  if (user.isVerified) {
    const { status, message } = RESPONSE.ERROR.EMAIL_ALREADY_VERIFIED;
    return res.status(status).json({ message });
  }

  try {
    // Generate new verification code and expiration
    const { verificationCode, verificationCodeExpires } =
      await sendVerificationEmail({ email, name: user.name });

    // Update user with new verification details
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;

    // Save the user with new verification details
    await user.save();

    // Respond to the client
    return res
      .status(RESPONSE.SUCCESS.OK.status) // Assuming 200 is success
      .json({ message: "Verification email resent successfully!" });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return res
      .status(RESPONSE.ERROR.SERVER_ERROR.status) // Assuming a server error
      .json({ message: "Failed to resend verification email." });
  }
});

export default router;
