const {scrapeAmazonProduct} = require('./scrapper/amazonScrapper');
const {connectToDB} = require('./config/db');
const {Product} = require('./model/productModel');
const {getLowestPrice, getAveragePrice, getHighestPrice} = require('./utils');

async function scrapeAndStoreProduct(productUrl){
    if(!productUrl) return;

    try {
        connectToDB();
        const amazonData = await scrapeAmazonProduct(productUrl);
        let product = amazonData;

        const existingProduct = await Product.findOne({url: amazonData.url});
        if(existingProduct){
            const updatedPriceHistory = [
                ...existingProduct.priceHistory,
                {price: amazonData.price}
            ]

            product = {
                ...amazonData,
                priceHistory: updatedPriceHistory,
                lowestPrice: getLowestPrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory),
            }
        }
        const newProduct = await Product.findOneAndUpdate(
            {url: amazonData.url},
            product,
            { upsert: true, new: true}
        )
    } catch (error) {
        throw error
    }
}

scrapeAndStoreProduct('https://www.amazon.in/dp/B0CHZ16M8N/ref=sspa_dk_detail_2?psc=1&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWxfdGhlbWF0aWM')