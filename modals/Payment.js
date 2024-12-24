import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Reference to User
    amount: { type: Number, required: true }, // Payment amount
    date: { type: Date, default: Date.now }, // Payment date
    subscriptionType: {
      type: String,
      enum: ["monthly", "yearly", "one-time"],
      required: true,
    }, // Subscription type
    transactionId: { type: String, unique: true, required: true }, // Unique transaction ID
    promoCode: { type: String, default: null }, // Promo code used (optional)
    discountAmount: { type: Number, default: 0 }, // Discount applied due to promo code
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;
