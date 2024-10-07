import { configDotenv } from "dotenv";
import nodemailer from "nodemailer";
configDotenv();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "zetta.mohr34@ethereal.email",
    pass: "4nSh842RtDJ1t9wQrK",
  },
});
export { transporter };
