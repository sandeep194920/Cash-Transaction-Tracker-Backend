import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import RESPONSE from "../../responseCodes.js";

const router = express.Router();

const User = mongoose.model("User");
const Transaction = mongoose.model("Transaction");
const JWT_SECRET = process.env.JWT_SECRET;

// Endpoint to get all transactions associated with a customer
router.get("/customer/transactions", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { customerID } = req.query; // Assuming customerID is passed as a query param

  if (!token) {
    return res
      .status(RESPONSE.ERROR.UNAUTHORIZED.status)
      .json({ message: "No token provided." });
  }

  if (!customerID) {
    return res
      .status(RESPONSE.ERROR.BAD_REQUEST.status)
      .json({ message: "No customerID provided." });
  }

  try {
    // Verify JWT token and extract user email
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email;

    // Fetch the logged-in user
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res
        .status(RESPONSE.ERROR.NOT_FOUND.status)
        .json({ message: "User not found." });
    }
    // Fetch all transactions related to the specified customer and the logged-in user
    const transactions = await Transaction.find({
      customer: customerID,
      user: user._id,
    });

    if (transactions.length === 0) {
      return res
        .status(RESPONSE.SUCCESS.OK.status)
        .json({ message: "No transactions found for this customer." });
    }

    res
      .status(RESPONSE.SUCCESS.OK.status)
      .json({ message: "Transactions retrieved successfully.", transactions });
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    res
      .status(RESPONSE.ERROR.INTERNAL_SERVER_ERROR.status)
      .json({ message: "Failed to retrieve transactions." });
  }
});

export default router;
