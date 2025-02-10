const { scrapeAmazonProduct } = require('../scrapper/amazonScrapper');
const { scrapeFlipkartProduct } = require('../scrapper/flipkartScrapper');
const { connectToDB } = require('../config/db');
const { Product } = require('../model/productModel');
const { getLowestPrice, getAveragePrice, getHighestPrice } = require('../utils/utils');

const scrapeAndStoreProduct = async (req, res) => {
    const { amazonUrl, flipkartUrl, emailId, thresholdPrice } = req.body;

    if (!amazonUrl && !flipkartUrl) {
        return res.status(400).json({ message: 'Product URL is required' });
    }

    try {
        connectToDB();

        if (amazonUrl) {
            try {
                const amazonData = await scrapeAmazonProduct(amazonUrl);
                let product = amazonData;

                if (!amazonData.outOfStock && amazonData.price !== 0) {
                    const existingProduct = await Product.findOne({ url: amazonData.url });

                    if (existingProduct) {
                        const updatedPriceHistory = [
                            ...existingProduct.priceHistory,
                            { price: amazonData.price }
                        ];

                        product = {
                            ...amazonData,
                            priceHistory: updatedPriceHistory,
                            lowestPrice: getLowestPrice(updatedPriceHistory),
                            highestPrice: getHighestPrice(updatedPriceHistory),
                            averagePrice: getAveragePrice(updatedPriceHistory),
                            users: updateUsersList(existingProduct.users, emailId, thresholdPrice)
                        };
                    } else {
                        product.users = [{ email: emailId, targetPrice: thresholdPrice }];
                    }

                    await Product.findOneAndUpdate(
                        { url: amazonData.url },
                        product,
                        { upsert: true, new: true }
                    );
                }
            } catch (error) {
                console.error('Error scraping Amazon:', error);
            }
        }

        if (flipkartUrl) {
            try {
                const flipkartData = await scrapeFlipkartProduct(flipkartUrl);
                let product = flipkartData;

                if (!flipkartData.outOfStock && flipkartData.price !== 0) {
                    const existingProduct = await Product.findOne({ url: flipkartData.url });

                    if (existingProduct) {
                        const updatedPriceHistory = [
                            ...existingProduct.priceHistory,
                            { price: flipkartData.price }
                        ];

                        product = {
                            ...flipkartData,
                            priceHistory: updatedPriceHistory,
                            lowestPrice: getLowestPrice(updatedPriceHistory),
                            highestPrice: getHighestPrice(updatedPriceHistory),
                            averagePrice: getAveragePrice(updatedPriceHistory),
                            users: updateUsersList(existingProduct.users, emailId, thresholdPrice)
                        };
                    } else {
                        product.users = [{ email: emailId, targetPrice: thresholdPrice }];
                    }

                    await Product.findOneAndUpdate(
                        { url: flipkartData.url },
                        product,
                        { upsert: true, new: true }
                    );
                }
            } catch (error) {
                console.error('Error scraping Flipkart:', error);
            }
        }

        res.status(200).json({ status: 'success' });

    } catch (error) {
        res.status(500).json({
            status: 'Error occurred while scraping or storing product',
            error: error.message,
        });
    }
};

// Helper function to update the users list
const updateUsersList = (existingUsers, emailId, thresholdPrice) => {
    if (!emailId) return existingUsers;

    const userExists = existingUsers.some(user => user.email === emailId);

    if (!userExists) {
        return [...existingUsers, { email: emailId, targetPrice: thresholdPrice }];
    }

    return existingUsers;
};


const scrapeProduct = async (req, res) => {
    const { amazonUrl, flipkartUrl } = req.body;

    if (!amazonUrl && !flipkartUrl) {
        return res.status(400).json({ message: 'At least one product URL is required' });
    }

    try {
        let response = { status: 'success', products: [] };
        
        if (amazonUrl && amazonUrl.includes('amazon')) {
            const amazonData = await scrapeAmazonProduct(amazonUrl);
            response.products.push({ source: 'Amazon', data: amazonData });
        }
        
        if (flipkartUrl && flipkartUrl.includes('flipkart')) {
            const flipkartData = await scrapeFlipkartProduct(flipkartUrl);
            response.products.push({ source: 'Flipkart', data: flipkartData });
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error occurred while scraping product',
            error: error.message,
        });
    }
};

module.exports = { scrapeAndStoreProduct, scrapeProduct};
