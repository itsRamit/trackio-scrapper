const {scrapeAmazonProduct} = require('./scrapper/amazonScrapper');
const {connectToDB} = require('./config/db');

async function scrapeAndStoreProduct(productUrl){
    if(!productUrl) return;

    try {
        connectToDB();
        const amazonData = scrapeAmazonProduct(productUrl);
        console.log(amazonData);
    } catch (error) {
        throw error
    }
}

scrapeAndStoreProduct('https://www.amazon.in/dp/B0CHZ16M8N/ref=sspa_dk_detail_2?psc=1&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWxfdGhlbWF0aWM')