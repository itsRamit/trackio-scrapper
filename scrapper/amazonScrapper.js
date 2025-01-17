const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeAmazonProduct(url){
    if(!url) return;

    try{
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const title = $('#productTitle').text().trim();
        const price = $('.priceToPay span.a-price-whole').text().trim() || $('.a.size.base.a-color-price').text().trim() || $('.a-button-selected .a-color-base').text().trim() || $('.a-price.a-text-price').text().trim();
        const outOfStock = $("#avaibility span").text().trim().toLowerCase() === 'currently unavailable';
        const images = $('#imgBlkFront').attr('data-a-dynamic-image') || $('#landingImage').attr('data-a-dynamic-image') || '{}';
        const imageUrls = Object.keys(JSON.parse(images));
        
        const data = {
            url,
            title,
            price : parseInt(price.replace(/,/g, ""), 10),
            image : imageUrls[0],
            priceHistory : [],   
            outOfStock,
            lowestPrice : parseInt(price.replace(/,/g, ""), 10),
            highestPrice : parseInt(price.replace(/,/g, ""), 10),
            averagePrice : parseInt(price.replace(/,/g, ""), 10),
        }
        console.log(data)
        return data;
    }catch(e){
        throw e;
    }
}

module.exports = {scrapeAmazonProduct}

