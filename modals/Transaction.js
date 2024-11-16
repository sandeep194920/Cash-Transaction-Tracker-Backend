import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const TransactionSchema = new mongoose.Schema(
  {
    items: [ItemSchema], // Array of items purchased
    transactionDate: { type: Date, required: true }, // TODO: Change to date
    grossPrice: { type: Number, required: true }, // Total cost of the order
    taxPercentage: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    amountPaid: { type: Number, required: true }, // Amount paid by the customer
    balanceAmount: {
      type: Number,
      required: true,
      set: (v) => parseFloat(v.toFixed(2)), // the amount must be fixed to 2 decimal places
    }, // Remaining balance after payment
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    }, // Reference to the customer
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the logged-in user,

    // BalanceAdjust is also considered as transaction, so adding this field to differentiate the transaction
    transactionType: {
      type: String,
      enum: ["transaction", "balanceUpdate"],
      default: "transaction",
      required: true,
    },
    balanceType: {
      type: String,
      enum: ["settle-up", "positive", "negative"],
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
