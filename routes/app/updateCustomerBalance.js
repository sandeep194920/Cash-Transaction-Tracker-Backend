import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import RESPONSE from "../../responseCodes.js";

const router = express.Router();

const balanceTypes = ["settle-up", "positive", "negative"];

const User = mongoose.model("User");
const Customer = mongoose.model("Customer");
const Transaction = mongoose.model("Transaction");
const JWT_SECRET = process.env.JWT_SECRET;

// Endpoint to get all customers associated with the logged-in user
router.post("/update-customer-balance", async (req, res) => {
  console.log("/update-customer-balance");

  const token = req.headers.authorization?.split(" ")[1];
  const { customerID, newBalanceAmount, balanceType } = req.body; // Assuming customerID is passed as a query param

  if (!token) {
    return res
      .status(RESPONSE.ERROR.UNAUTHORIZED.status)
      .json({ message: "No token provided." });
  }

  if (!balanceTypes.includes(balanceType)) {
    return res
      .status(RESPONSE.ERROR.NOT_FOUND.status)
      .json({ message: "Not a valid balance-type" });
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
    const customer = await Customer.findOne({
      user: user._id,
      _id: customerID,
    });
    if (!customer) {
      return res
        .status(RESPONSE.SUCCESS.OK.status)
        .json({ message: "No customers found." });
    }

    const oldBalance = customer.totalBalance;

    if (balanceType === "settle-up") {
      if (customer.totalBalance === 0) {
        return res
          .status(RESPONSE.ERROR.UNAUTHORIZED.status)
          .json({ message: "Balance is 0 already" });
      } else {
        customer.totalBalance = 0;
      }
    } else {
      if (balanceType === "positive") {
        customer.totalBalance = -1 * newBalanceAmount;
      } else {
        customer.totalBalance = newBalanceAmount;
      }
    }

    const transaction = new Transaction({
      transactionType: "balanceUpdate",
      items: [],
      transactionDate: new Date(), // Parse the date string to Date type
      grossPrice: 0,
      taxPercentage: 0,
      totalPrice: 0,
      amountPaid: balanceType === "settle-up" ? oldBalance : newBalanceAmount,
      balanceAmount:
        balanceType === "positive" ? -1 * newBalanceAmount : newBalanceAmount,
      balanceType,
      customer: customer._id,
      user: user._id,
    });

    if (balanceType === "settle-up") {
      user.userTotal = user.userTotal - oldBalance;
    } else if (balanceType === "positive") {
      user.userTotal = user.userTotal - oldBalance - newBalanceAmount;
    } else {
      user.userTotal = user.userTotal - oldBalance + newBalanceAmount;
    }

    await transaction.save();
    await customer.save();
    await user.save();

    return res
      .status(RESPONSE.SUCCESS.OK.status)
      .json({ message: "Balance updated successfully.", transaction });
  } catch (error) {
    console.error("Error retrieving customers:", error);
    res
      .status(RESPONSE.ERROR.INTERNAL_SERVER_ERROR.status)
      .json({ message: "Failed to retrieve customers." });
  }
});

export default router;
