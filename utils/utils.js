const nodemailer = require('nodemailer');

const sendNotification = async (email, title, currentPrice, url) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, 
            },
        });

        const mailOptions = {
            from: `"Price Tracker" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Price Drop Alert: ${title}`,
            html: `<p>The price of <b>${title}</b> has dropped to ₹${currentPrice}!</p>
                   <p>Check it out: <a href="${url}">${url}</a></p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Notification sent to ${email}`);
    } catch (error) {
        console.error(`Error sending email to ${email}:`, error.message);
    }
};



function extractPrice(...elements) {
  for (const element of elements) {
    const priceText = element.text().trim();

    if (priceText) {
      const cleanPrice = priceText.replace(/[^\d.]/g, '');

      let firstPrice;

      if (cleanPrice) {
        firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
      }

      return firstPrice || cleanPrice;
    }
  }

  return '';
}

// Extracts and returns the currency symbol from an element.
function extractCurrency(element) {
  const currencyText = element.text().trim().slice(0, 1);
  return currencyText ? currencyText : '';
}

function getHighestPrice(priceList) {
  let highestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price > highestPrice.price) {
      highestPrice = priceList[i];
    }
  }

  return highestPrice.price;
}

function getLowestPrice(priceList) {
  let lowestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price < lowestPrice.price) {
      lowestPrice = priceList[i];
    }
  }

  return lowestPrice.price;
}

function getAveragePrice(priceList) {
  const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
  const averagePrice = sumOfPrices / priceList.length || 0;

  return averagePrice;
}


function formatNumber(num = 0) {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}



module.exports = {
  extractPrice,
  extractCurrency,
  getHighestPrice,
  getLowestPrice,
  getAveragePrice,
  formatNumber,
  sendNotification
};
  