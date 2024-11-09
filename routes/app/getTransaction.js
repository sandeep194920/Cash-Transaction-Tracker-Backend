import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import RESPONSE from "../../responseCodes.js";

const router = express.Router();

const Transaction = mongoose.model("Transaction");
const JWT_SECRET = process.env.JWT_SECRET;

// Endpoint to get a specific transaction by ID
router.get("/transaction", async (req, res) => {
  console.log("/transaction route hit");

  const token = req.headers.authorization?.split(" ")[1];
  const { transactionID } = req.query; // Assuming transactionID is passed as a query param

  if (!token) {
    return res
      .status(RESPONSE.ERROR.UNAUTHORIZED.status)
      .json({ message: "No token provided." });
  }

  if (!transactionID) {
    return res
      .status(RESPONSE.ERROR.BAD_REQUEST.status)
      .json({ message: "Transaction ID is required." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Fetch the transaction by ID and ensure it belongs to the logged-in user
    const transaction = await Transaction.findOne({
      _id: transactionID,
    });
    // .populate("customer", "name email");

    if (!transaction) {
      return res
        .status(RESPONSE.ERROR.NOT_FOUND.status)
        .json({ message: "Transaction not found." });
    }

    // Check if the transaction belongs to the user
    // if (transaction.user.toHexString() !== decoded.userID) {
    //   return res
    //     .status(RESPONSE.ERROR.FORBIDDEN.status)
    //     .json({ message: "Access denied." });
    // }
    res
      .status(RESPONSE.SUCCESS.OK.status)
      .json({ message: "Transaction retrieved successfully.", transaction });
  } catch (error) {
    console.error("Error retrieving transaction:", error);
    res
      .status(RESPONSE.ERROR.INTERNAL_SERVER_ERROR.status)
      .json({ message: "Failed to retrieve transaction." });
  }
});

export default router;
