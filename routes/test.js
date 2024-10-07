import express from "express";
import RESPONSE from "../responseCodes.js";

const router = express.Router();

router.get("/", (req, res) => {
  return res
    .status(RESPONSE.SUCCESS.OK.status)
    .json({ data: RESPONSE.SUCCESS.OK.message });
});

export default router;
