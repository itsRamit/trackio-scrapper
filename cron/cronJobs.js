const cron = require('node-cron');
const { Product } = require('../model/productModel');
const { scrapeAmazonProduct } = require('../scrapper/amazonScrapper');
const { scrapeFlipkartProduct } = require('../scrapper/flipkartScrapper');
const { generateEmailBody, sendEmail, Notification } = require('../utils/nodemailer');

const updateProductPrices = async () => {
    try {
        const products = await Product.find();

        for (const product of products) {
            let updatedData;

            if (product.url.includes('amazon')) {
                updatedData = await scrapeAmazonProduct(product.url);
            } else if (product.url.includes('flipkart')) {
                updatedData = await scrapeFlipkartProduct(product.url);
            }

            if (updatedData) {
                if (!updatedData.isOutOfStock) {
                    product.priceHistory.push({ price: updatedData.price });

                    const previousLowestPrice = product.lowestPrice || updatedData.price;

                    product.lowestPrice = Math.min(previousLowestPrice, updatedData.price);
                    product.highestPrice = Math.max(product.highestPrice || updatedData.price, updatedData.price);
                    product.averagePrice = Math.round(
                        product.priceHistory.reduce((sum, entry) => sum + entry.price, 0) / product.priceHistory.length
                    );

                    // Notify users if the price is at its lowest ever
                    if (updatedData.price < previousLowestPrice) {
                        for (const user of product.users) {
                            const emailContent = await generateEmailBody(
                                {
                                    title: product.title,
                                    url: product.url,
                                },
                                Notification.LOWEST_PRICE
                            );
                            await sendEmail(emailContent, [user.email]);
                        }
                    }

                    // Notify users if the price meets their target price
                    for (const user of product.users) {
                        if (user.targetPrice && updatedData.price <= user.targetPrice) {
                            const emailContent = await generateEmailBody(
                                {
                                    title: product.title,
                                    url: product.url,
                                },
                                Notification.THRESHOLD_MET
                            );
                            await sendEmail(emailContent, [user.email]);
                        }
                    }

                    product.price = updatedData.price;
                    product.isOutOfStock = false;
                } else {
                    product.isOutOfStock = true;
                }

                await product.save();
            }
        }
        console.log('Product prices updated successfully.');
    } catch (error) {
        console.error('Error updating product prices:', error.message);
    }
};

// Schedule the cron job to run every hour
cron.schedule('0 * * * *', updateProductPrices);

module.exports = { updateProductPrices };
