import crypto from "crypto";
import { VERIFY_EMAIL_TIME } from "../constants.js";
import dotenv from "dotenv";
import { sendEmail } from "../emails/sendEmail_on_prod.js";
import { transporter } from "../emails/sendEmail_on_test.js";

dotenv.config();

export const sendVerificationEmail = async ({ email, name }) => {
  const verificationCode = crypto.randomInt(1000, 9999).toString();
  const verificationCodeExpires = new Date(Date.now() + VERIFY_EMAIL_TIME);

  const mailOptions = {
    TEST: {
      from: '"Staar Coding - Support team" <staarcoding@gmail.com>',
      to: email,
      subject: "Verify your email",
      text: `Your verification code is: ${verificationCode}. It is valid for ${
        VERIFY_EMAIL_TIME / (60 * 1000)
      } minutes.`,
      html: `Hi ${name}, please verify your email.
       <b>Your verification code is: ${verificationCode}. It is valid for ${
        VERIFY_EMAIL_TIME / (60 * 1000)
      } minutes.</b>`,
    },
    PROD: {
      subject: "Verify your email",
      htmlBody: `Hi ${name}, please verify your email. Your verification code is: <h2>${verificationCode}</h2>
          <p>It is valid for ${
            VERIFY_EMAIL_TIME / (60 * 1000)
          } minutes. Type this code in the app's verification screen.</p>
        `,
      recipient: {
        name,
        email,
      },
    },
  };

  if (process.env.ENV === "PROD") {
    await sendEmail(mailOptions["PROD"]);
  } else {
    await transporter.sendMail(mailOptions["TEST"]);
  }

  return {
    verificationCode,
    verificationCodeExpires,
  };
};
