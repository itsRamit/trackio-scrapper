require('dotenv').config({ path: './.env' });
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeFlipkartProduct(url) {
  if (!url) return;

  const apiKey = process.env.SCRAPER_API_KEY;
  const apiUrl = `http://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(url)}&country_code=in`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 60000,
    });

    const $ = cheerio.load(response.data);

    const title = $('.VU-ZEz').text().trim() || 'N/A';
    const priceText = $('.Nx9bqj.CxhGGd').text().replace(/₹|,/g, '').trim() || '0';
    const price = parseInt(priceText, 10);

    const outOfStock = $('.QqFHMw.AMnSvF.v6sqKe').text().toLowerCase().trim() === 'notify me';

    const imageUrl =
      $('img.DByuf4.IZexXJ.jLEJ7H').attr('src') ||
      $('img._53J4C-.utBuJY').attr('src') ||
      '';

    const description =
      $('.yN+eNk').text().trim() ||
      $('.yN+eNk.w9jEaj').text().trim() ||
      $('._4aGEkW').text().trim() ||
      'N/A';

    const data = {
      url,
      platform: 'flipkart',
      title,
      description,
      price,
      image: imageUrl,
      priceHistory: [],
      outOfStock,
      lowestPrice: price,
      highestPrice: price,
      averagePrice: price,
    };

    console.log(data);
    return data;
  } catch (error) {
    console.error('Scraping Error:', error.message);
    throw error;
  }
}

module.exports = { scrapeFlipkartProduct };
