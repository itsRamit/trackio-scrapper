const cron = require('node-cron');
const { Product } = require('../model/productModel');
const { scrapeAmazonProduct } = require('../scrapper/amazonScrapper');
const { scrapeFlipkartProduct } = require('../scrapper/flipkartScrapper');
// const { sendNotification } = require('../utils');

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

                    product.lowestPrice = Math.min(product.lowestPrice || updatedData.price, updatedData.price);
                    product.highestPrice = Math.max(product.highestPrice || updatedData.price, updatedData.price);
                    product.averagePrice = Math.round(
                        product.priceHistory.reduce((sum, entry) => sum + entry.price, 0) / product.priceHistory.length
                    );

                    if (updatedData.price < product.lowestPrice) {
                        sendNotification(product.title, updatedData.price, product.url);
                    }

                    product.price = updatedData.price;
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

cron.schedule('0 * * * *', updateProductPrices);

module.exports = { updateProductPrices };
