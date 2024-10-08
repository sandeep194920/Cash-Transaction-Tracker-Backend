import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import RESPONSE from "../../responseCodes.js";

const router = express.Router();
const User = mongoose.model("User");
const JWT_SECRET = process.env.JWT_SECRET;

// Endpoint to fetch user data based on the token
router.get("/user-data", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get the token from the Authorization header

  // Check if the token is provided
  if (!token) {
    return res
      .status(RESPONSE.ERROR.UNAUTHORIZED.status) // 401 status
      .json({ message: "No token provided." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email; // Extract email from the decoded token

    // Fetch the user from the database using the email
    const user = await User.findOne({ email: userEmail });

    const userData = {
      name: user.name,
      email: user.email,
      phone: user.phone,
    };

    if (user) {
      // If user found, return success response with user data
      return res.status(RESPONSE.SUCCESS.OK.status).json(userData);
    } else {
      // If user not found, return not found error
      return res
        .status(RESPONSE.ERROR.NOT_FOUND.status)
        .json({ message: RESPONSE.ERROR.NOT_FOUND.message });
    }
  } catch (error) {
    console.error("Error verifying token:", error);

    // Handle token verification error
    return res
      .status(RESPONSE.ERROR.INVALID_TOKEN.status)
      .json({ message: RESPONSE.ERROR.INVALID_TOKEN.message });
  }
});

export default router;
