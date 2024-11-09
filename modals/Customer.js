import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String }, // Optional
    totalBalance: {
      type: Number,
      required: true,
      default: 0,
      set: (v) => parseFloat(v.toFixed(2)),
    }, // Starting balance is zero
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the logged-in user
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", CustomerSchema);
export default Customer;
