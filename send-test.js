const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function testEmail() {
  try {
    await sgMail.send({
      to: "your_email@gmail.com",
      from: process.env.SENDGRID_SENDER,
      subject: "Test SwiftInvoice Email",
      text: "If you see this, SendGrid works!",
    });
    console.log("Email sent successfully");
  } catch (err) {
    console.error(
      "SendGrid Error:",
      process.env.SENDGRID_API_KEY,
      err.response ? err.response.body : err,
    );
  }
}

testEmail();
