const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeFlipkartProduct(url){
    if(!url) return;

    try{
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
            },
        });
        const $ = cheerio.load(response.data);
        const title = $('.VU-ZEz').text().trim();
        const price = $('.Nx9bqj.CxhGGd').text().trim();
        const outOfStock = $(".QqFHMw.AMnSvF.v6sqKe").text().trim().toLowerCase() === 'notify me';
        const imageUrl = $('img.DByuf4.IZexXJ.jLEJ7H').attr('src') || $('img._53J4C-.utBuJY').attr('src');
        const data = {
            url,
            title,
            price : parseInt(price.replace(/₹|,/g, ''), 10),
            image : imageUrl,
            priceHistory : [],   
            outOfStock,
            lowestPrice : parseInt(price.replace(/₹|,/g, ''), 10),
            highestPrice : parseInt(price.replace(/₹|,/g, ''), 10),
            averagePrice : parseInt(price.replace(/₹|,/g, ''), 10),
        }
        console.log(data)
        return data;
    }catch(e){
        throw e;
    }
}
module.exports = {scrapeFlipkartProduct}

