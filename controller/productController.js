const { scrapeAmazonProduct } = require('../scrapper/amazonScrapper');
const { connectToDB } = require('../config/db');
const { Product } = require('../model/productModel');
const { getLowestPrice, getAveragePrice, getHighestPrice } = require('../utils');

// Controller Function for Scraping and Storing Product
const scrapeAndStoreProduct = async (req, res) => {
    const { productUrl } = req.body; // Extract product URL from request body

    if (!productUrl) {
        return res.status(400).json({ message: 'Product URL is required' });
    }

    try {
        connectToDB(); // Connect to the database

        // Scrape product data from Amazon
        const amazonData = await scrapeAmazonProduct(productUrl);
        let product = amazonData;

        // Check if the product already exists in the database
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
            };
        }

        // Upsert the product into the database
        const newProduct = await Product.findOneAndUpdate(
            { url: amazonData.url },
            product,
            { upsert: true, new: true }
        );

        // Respond with the newly stored or updated product
        res.status(200).json({
            message: 'Product data successfully stored or updated',
            product: newProduct
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error occurred while scraping or storing product',
            error: error.message,
        });
    }
};

module.exports = { scrapeAndStoreProduct };
