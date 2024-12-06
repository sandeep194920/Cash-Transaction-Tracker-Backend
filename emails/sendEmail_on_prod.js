import brevo from "@getbrevo/brevo";
let apiInstance = new brevo.TransactionalEmailsApi();
import { configDotenv } from "dotenv";

configDotenv();
export const sendEmail = async ({ subject, htmlBody, recipient }) => {
  let apiKey = apiInstance.authentications["apiKey"];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  let sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlBody;
  sendSmtpEmail.sender = {
    name: "STAAR CODING",
    email: "staarcoding@gmail.com",
  };
  sendSmtpEmail.to = [{ email: recipient.email, name: "recipient name" }];
  sendSmtpEmail.replyTo = {
    name: "STAAR CODING",
    email: "staarcoding@gmail.com",
  };
  //   sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log(
        "API called successfully. Returned data: " + JSON.stringify(data)
      );
    },
    function (error) {
      console.error("The email sending error -", error);
    }
  );
};
