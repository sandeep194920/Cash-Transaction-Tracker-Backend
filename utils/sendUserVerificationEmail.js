// Send verification email
import crypto from "crypto";
import { transporter } from "../utils/sendEmail.js";
import { VERIFY_EMAIL_TIME } from "../constants.js";

export const sendVerificationEmail = async (email) => {
  const verificationCode = crypto.randomInt(1000, 9999).toString();
  const verificationCodeExpires = new Date(Date.now() + VERIFY_EMAIL_TIME); // 5 minutes from now

  const mailOptions = {
    from: '"Support Team" <support@example.com>', // fake support email
    to: email, // recipient email (for testing, any email can be used)
    subject: "Verify your email",
    text: `Your verification code is: ${verificationCode}. It is valid for ${
      VERIFY_EMAIL_TIME / (60 * 1000)
    } minutes.`,
    html: `<b>Your verification code is: ${verificationCode}. It is valid for ${
      VERIFY_EMAIL_TIME / (60 * 1000)
    } minutes.</b>`,
  };

  await transporter.sendMail(mailOptions);
  return {
    verificationCode,
    verificationCodeExpires,
  };
};
