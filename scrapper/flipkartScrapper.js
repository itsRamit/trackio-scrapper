
require('dotenv').config({ path: './.env' }); 
const axios = require('axios');
const cheerio = require('cheerio');
const http = require('http');

async function scrapeFlipkartProduct(url) {
    if (!url) return;

    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 22225;
    const session_id = (1000000 * Math.random()) | 0;

    const proxy = `http://${username}-session-${session_id}:${password}@brd.superproxy.io:${port}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
            },
            proxy: false, 
            httpAgent: new http.Agent({ proxy }),
        });

        const $ = cheerio.load(response.data);
        const title = $('.VU-ZEz').text().trim();
        const price = $('.Nx9bqj.CxhGGd').text().trim();
        const outOfStock = $(".QqFHMw.AMnSvF.v6sqKe").text().trim().toLowerCase() === 'notify me';
        const imageUrl = $('img.DByuf4.IZexXJ.jLEJ7H').attr('src') || $('img._53J4C-.utBuJY').attr('src');

        const data = {
            url,
            platform: "flipkart",
            title,
            price: parseInt(price.replace(/₹|,/g, ''), 10),
            image: imageUrl,
            priceHistory: [],
            outOfStock,
            lowestPrice: parseInt(price.replace(/₹|,/g, ''), 10),
            highestPrice: parseInt(price.replace(/₹|,/g, ''), 10),
            averagePrice: parseInt(price.replace(/₹|,/g, ''), 10),
        };

        console.log(data);
        return data;
    } catch (e) {
        console.error('Error:', e.message);
        throw e;
    }
}

module.exports = { scrapeFlipkartProduct };
