require('dotenv').config({ path: './.env' }); 
const axios = require('axios');
const cheerio = require('cheerio');
const http = require('http');

async function scrapeAmazonProduct(url){
    if(!url) return;

    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 22225;
    const session_id = (1000000 * Math.random()) | 0;

    const proxy = `http://${username}-session-${session_id}:${password}@brd.superproxy.io:${port}`;

    try{
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
            },
            proxy: false, 
            httpAgent: new http.Agent({ proxy }),
        });
        const $ = cheerio.load(response.data);
        const title = $('#productTitle').text().trim();
        const price = $('.priceToPay span.a-price-whole').text().trim() || $('.a.size.base.a-color-price').text().trim() || $('.a-button-selected .a-color-base').text().trim() || $('.a-price.a-text-price').text().trim() || '0';
        const outOfStock = $("#avaibility span").text().trim().toLowerCase() === 'currently unavailable';
        const images = $('#imgBlkFront').attr('data-a-dynamic-image') || $('#landingImage').attr('data-a-dynamic-image') || '{}';
        const imageUrls = Object.keys(JSON.parse(images));
        
        const data = {
            url,
            platform: "amazon",
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

