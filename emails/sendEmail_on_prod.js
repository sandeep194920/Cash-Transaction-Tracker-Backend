import brevo from "@getbrevo/brevo";
let apiInstance = new brevo.TransactionalEmailsApi();
import { configDotenv } from "dotenv";

configDotenv();

const senderInfo = {
  name: "Staar Coding - Support team",
  email: "staarcoding@gmail.com",
};

export const sendEmail = async ({ subject, htmlBody, recipient }) => {
  let apiKey = apiInstance.authentications["apiKey"];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  let sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlBody;
  sendSmtpEmail.sender = senderInfo;
  sendSmtpEmail.to = [{ email: recipient.email, name: "recipient name" }];
  sendSmtpEmail.replyTo = senderInfo;
  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      // TODO: Add sentry/other debug logs
      console.log(
        "API called successfully. Returned data: " + JSON.stringify(data)
      );
    },
    function (error) {
      // TODO: Add sentry/other debug logs
      console.error("The email sending error -", error);
    }
  );
};
