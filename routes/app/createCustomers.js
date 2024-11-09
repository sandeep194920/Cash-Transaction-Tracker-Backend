import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import RESPONSE from "../../responseCodes.js";

const router = express.Router();

const User = mongoose.model("User");
const Customer = mongoose.model("Customer");
const JWT_SECRET = process.env.JWT_SECRET;

// Endpoint to create a new customer
router.post("/add-customer", async (req, res) => {
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

    const { name, email, phone, address, totalBalance } = req.body;

    // Create a new customer associated with the logged-in user
    const customer = new Customer({
      name,
      email,
      phone,
      address,
      totalBalance,
      user: user._id, // Associate customer with the logged-in user
    });
    await customer.save();
    res
      .status(RESPONSE.SUCCESS.CREATED.status)
      .json({ message: "Customer created successfully.", customer });
  } catch (error) {
    console.error("Error creating customer:", error);
    res
      .status(RESPONSE.ERROR.SERVER_ERROR.status)
      .json({ message: "Failed to create customer." });
  }
});

export default router;
