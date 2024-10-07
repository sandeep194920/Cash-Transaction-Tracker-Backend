import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import RESPONSE from "../../responseCodes.js";

const router = express.Router();
const User = mongoose.model("User");
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/user-data", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email;

    const user = await User.findOne({ email: userEmail });
    if (user) {
      return res
        .status(RESPONSE.SUCCESS.OK.status)
        .json({ status: "ok", data: user });
    } else {
      return res
        .status(RESPONSE.ERROR.NOT_FOUND.status)
        .json({ message: RESPONSE.ERROR.NOT_FOUND.message });
    }
  } catch (error) {
    return res
      .status(RESPONSE.ERROR.INVALID_TOKEN.status)
      .json({ message: RESPONSE.ERROR.INVALID_TOKEN.message });
  }
});

export default router;
