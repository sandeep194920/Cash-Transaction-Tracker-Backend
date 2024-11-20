import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import RESPONSE from "../../responseCodes.js";

const router = express.Router();

const User = mongoose.model("User");
const Customer = mongoose.model("Customer");
const JWT_SECRET = process.env.JWT_SECRET;

// Endpoint to create a new customer
router.post("/edit-customer", async (req, res) => {
  console.log("/edit-customer");
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

    const { name, email, phone, address, customerID } = req.body;
    console.log("The cust id is", customerID);
    const customer = await Customer.findById(customerID);

    if (!customer) {
      console.log("No customer found");
      return res
        .status(RESPONSE.ERROR.NOT_FOUND.status)
        .json({ message: "Customer not found." });
    }

    (customer.name = name),
      (customer.email = email),
      (customer.address = address),
      (customer.phone = phone);

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
