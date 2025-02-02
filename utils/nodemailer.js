require('dotenv').config({ path: './.env' }); 
const nodemailer = require("nodemailer");

const Notification = {
  LOWEST_PRICE: "LOWEST_PRICE",
  THRESHOLD_MET: "THRESHOLD_MET",
};

async function generateEmailBody(product, type) {
  const shortenedTitle =
    product.title.length > 20
      ? `${product.title.substring(0, 20)}...`
      : product.title;

  let subject = "";
  let body = "";

  switch (type) {
    case Notification.LOWEST_PRICE:
      subject = `Lowest Price Alert for ${shortenedTitle}`;
      body = `
        <div>
          <h4>Hey, ${product.title} has reached its lowest price ever!!</h4>
          <p>Grab it now at the best price! <a href="${product.url}" target="_blank">Check it out here</a>.</p>
        </div>
      `;
      break;

    case Notification.THRESHOLD_MET:
      subject = `Threshold Price Met for ${shortenedTitle}`;
      body = `
        <div>
          <h4>Hey, ${product.title} is now available at or below your target price!</h4>
          <p>Don't miss out! <a href="${product.url}" target="_blank">Buy it now</a>.</p>
        </div>
      `;
      break;

    default:
      throw new Error("Invalid notification type.");
  }

  return { subject, body };
}

const sendEmail = async (emailContent, sendTo) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: sendTo,
    subject: emailContent.subject,
    html: emailContent.body,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
  }
};

module.exports = { Notification, generateEmailBody, sendEmail };
