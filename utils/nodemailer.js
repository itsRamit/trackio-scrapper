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
      subject = `🔥 Lowest Price Alert for ${shortenedTitle}!`;
      body = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #ff6600; text-align: center;">🎉 Lowest Price Alert! 🎉</h2>
          <p style="font-size: 16px; color: #333;">Hey, <strong>${product.title}</strong> has reached its lowest price ever! This is the perfect time to grab it.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${product.url}" target="_blank" style="background-color: #ff6600; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold;">🔥 Buy Now</a>
          </div>
          <p style="text-align: center; font-size: 14px; color: #888;">Hurry up! Limited stock available.</p>
        </div>
      `;
      break;

    case Notification.THRESHOLD_MET:
      subject = `✅ Threshold Price Met for ${shortenedTitle}!`;
      body = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #008000; text-align: center;">💰 Your Target Price is Here!</h2>
          <p style="font-size: 16px; color: #333;">Hey, <strong>${product.title}</strong> is now available at or below your target price! Don't miss this opportunity.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${product.url}" target="_blank" style="background-color: #008000; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold;">💲 Buy Now</a>
          </div>
          <p style="text-align: center; font-size: 14px; color: #888;">Act fast before the price changes!</p>
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
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"Trackio" <trackionow@gmail.com>',
    to: sendTo,
    subject: emailContent.subject || "No Subject",
    text: "If you are seeing this, HTML is not rendering correctly.",
    html: emailContent.body || "<p>No body content</p>",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
  }
};

module.exports = {Notification, generateEmailBody, sendEmail};