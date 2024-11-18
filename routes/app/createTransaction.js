import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import RESPONSE from "../../responseCodes.js";

const router = express.Router();

const User = mongoose.model("User");
const Transaction = mongoose.model("Transaction");
const Customer = mongoose.model("Customer");
const JWT_SECRET = process.env.JWT_SECRET;

// Endpoint to create a transaction
router.post("/add-transaction", async (req, res) => {
  console.log("/add-transaction");
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
    const { items, customerID, amountPaid, transactionDate, taxPercentage } =
      req.body;

    console.log("The tax percentage from FE is", taxPercentage);

    // Validate the customer
    const customer = await Customer.findById(customerID);
    if (!customer) {
      return res
        .status(RESPONSE.ERROR.NOT_FOUND.status)
        .json({ message: "Customer not found." });
    }

    // Calculate grossPrice and orderPrice using the items array
    const grossPrice = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Calculate tax amount and total price
    const taxAmount = (grossPrice * taxPercentage) / 100;
    const totalPrice = grossPrice + taxAmount;

    // Calculate balance amount
    const balanceAmount = customer.totalBalance + totalPrice - amountPaid;
    // Create a new transaction associated with the customer and user
    const transaction = new Transaction({
      items,
      transactionDate, // Parse the date string to Date type
      grossPrice,
      taxPercentage,
      totalPrice,
      amountPaid,
      balanceAmount,
      customer: customer._id,
      user: user._id,
    });

    customer.totalBalance = balanceAmount;

    console.log("customer", customer);
    console.log("transaction", transaction);
    await transaction.save();
    await customer.save();

    user.userTotal = user.userTotal + balanceAmount;

    await user.save();

    res.status(RESPONSE.SUCCESS.CREATED.status).json({
      message: "Transaction created successfully.",
      transaction,
    });
  } catch (error) {
    console.log("ERROR OCCURRED", error);
    console.error("Error creating transaction:", error);
    res
      .status(RESPONSE.ERROR.SERVER_ERROR.status)
      .json({ message: "Failed to create transaction." });
  }
});

export default router;
