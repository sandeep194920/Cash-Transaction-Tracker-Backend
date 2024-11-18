import { configDotenv } from "dotenv";
import nodemailer from "nodemailer";
configDotenv();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "willy29@ethereal.email",
    pass: "wRRsrxzUz1c1mf1NTg",
  },
});
export { transporter };
