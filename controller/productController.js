const { scrapeAmazonProduct } = require('../scrapper/amazonScrapper');
const { scrapeFlipkartProduct } = require('../scrapper/flipkartScrapper');
const { connectToDB } = require('../config/db');
const { Product } = require('../model/productModel');
const { getLowestPrice, getAveragePrice, getHighestPrice } = require('../utils');

const scrapeAndStoreProduct = async (req, res) => {
    const { amazonUrl, flipkartUrl } = req.body; 

    if (!amazonUrl && !flipkartUrl) {
        return res.status(400).json({ message: 'Product URL is required' });
    }

    try {
        connectToDB();

        if(amazonUrl){
            try {
                const amazonData = await scrapeAmazonProduct(amazonUrl);
                let product = amazonData;

                if(!amazonData.outOfStock && amazonData.price != 0){
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

                    const newProduct = await Product.findOneAndUpdate(
                        { url: amazonData.url },
                        product,
                        { upsert: true, new: true }
                    );
                }
            } catch (error) {
                
            }
        }

        if(flipkartUrl){
            try {
                const flipkartData = await scrapeFlipkartProduct(flipkartUrl);
                let product = flipkartData;

                if(!flipkartData.outOfStock && flipkartData.price != 0){
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
                        };
                    }

                    const newProduct = await Product.findOneAndUpdate(
                        { url: flipkartData.url },
                        product,
                        { upsert: true, new: true }
                    );
                }
            } catch (error) {
                
            }
        }

        res.status(200).json({
            status: 'success',
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error occurred while scraping or storing product',
            error: error.message,
        });
    }
};

module.exports = { scrapeAndStoreProduct };
