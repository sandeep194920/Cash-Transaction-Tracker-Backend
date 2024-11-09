import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import RESPONSE from "../../responseCodes.js";

const router = express.Router();

const User = mongoose.model("User");
const Customer = mongoose.model("Customer");
const JWT_SECRET = process.env.JWT_SECRET;

// Endpoint to get all customers associated with the logged-in user
router.get("/customers", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(RESPONSE.ERROR.UNAUTHORIZED.status)
      .json({ message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email;

    // Fetch the logged-in user
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res
        .status(RESPONSE.ERROR.NOT_FOUND.status)
        .json({ message: "User not found." });
    }

    // Fetch all customers associated with the logged-in user
    const customers = await Customer.find({ user: user._id });

    if (customers.length === 0) {
      return res
        .status(RESPONSE.SUCCESS.OK.status)
        .json({ message: "No customers found." });
    }

    res
      .status(RESPONSE.SUCCESS.OK.status)
      .json({ message: "Customers retrieved successfully.", customers });
  } catch (error) {
    console.error("Error retrieving customers:", error);
    res
      .status(RESPONSE.ERROR.INTERNAL_SERVER_ERROR.status)
      .json({ message: "Failed to retrieve customers." });
  }
});

export default router;
