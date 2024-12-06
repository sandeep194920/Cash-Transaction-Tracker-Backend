import crypto from "crypto";
import { VERIFY_EMAIL_TIME } from "../constants.js";

// Below sendEmail is for sending emails on brevo (prod)
import { sendEmail } from "../emails/sendEmail_on_prod.js";

// Below 2 for sending emails on ethereal

// import { transporter } from "../emails/sendEmail_on_test.js";
// import { sendEmail } from "../emails/sendEmail.js";

export const sendVerificationEmail = async (email) => {
  const verificationCode = crypto.randomInt(1000, 9999).toString();
  const verificationCodeExpires = new Date(Date.now() + VERIFY_EMAIL_TIME); // 5 minutes from now

  // FOR TESTING PURPOSE - Use Ethereal,

  /*To use ethereal  */
  // const mailOptions = {
  //   from: '"Support Team" <support@example.com>', // fake support email
  //   to: email, // recipient email (for testing, any email can be used)
  //   subject: "Verify your email",
  //   text: `Your verification code is: ${verificationCode}. It is valid for ${
  //     VERIFY_EMAIL_TIME / (60 * 1000)
  //   } minutes.`,
  //   html: `<b>Your verification code is: ${verificationCode}. It is valid for ${
  //     VERIFY_EMAIL_TIME / (60 * 1000)
  //   } minutes.</b>`,
  // };

  // Uncomment this line for sending mails on ethereal
  // await transporter.sendMail(mailOptions);

  // --------------------------------------
  // FOR PROD - Use Brevo

  // prod email sending

  const mailOptions = {
    subject: "Verify your email",
    htmlBody: `<h2>Your verification code is: ${verificationCode}</h2>
      <p>It is valid for ${VERIFY_EMAIL_TIME / (60 * 1000)} minutes</p>
    `,
    recipient: {
      name: "",
      email,
    },
  };

  // prod email sending
  await sendEmail(mailOptions);

  return {
    verificationCode,
    verificationCodeExpires,
  };
};
