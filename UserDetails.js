import mongoose from "mongoose";

const UserDetailSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    image: String,
    gender: String,
    profession: String,
    userType: String,
  },
  {
    collection: "User",
  }
);
mongoose.model("User", UserDetailSchema);
