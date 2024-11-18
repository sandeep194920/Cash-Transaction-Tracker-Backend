import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    isVerified: { type: Boolean, default: false }, // Verification status
    verificationCode: String, // Code sent to the user's email
    verificationCodeExpires: Date, // Expiration time for the code
    userTotal: {
      type: Number,
      required: true,
      default: 0,
      set: (v) => parseFloat(v.toFixed(2)),
    },
  },
  { timestamps: true }
);

mongoose.model("User", UserSchema);
