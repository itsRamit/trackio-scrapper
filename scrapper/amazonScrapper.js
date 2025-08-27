require('dotenv').config({ path: './.env' });
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeAmazonProduct(url) {
  if (!url) return;

  try {
    const apiKey = process.env.SCRAPER_API_KEY;
    const apiUrl = `https://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(
      url
    )}&country_code=in`;

    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 60000,
    });

    const $ = cheerio.load(response.data);
    const title = $('#productTitle').text().trim();

    const price =
      $('.priceToPay span.a-price-whole').text().trim() ||
      $('.a.size.base.a-color-price').text().trim() ||
      $('.a-button-selected .a-color-base').text().trim() ||
      $('.a-price .a-offscreen').text().trim() ||
      '0';

    const outOfStock =
      $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

    const images =
      $('#imgBlkFront').attr('data-a-dynamic-image') ||
      $('#landingImage').attr('data-a-dynamic-image') ||
      '{}';

    const imageUrls = Object.keys(JSON.parse(images));
    const numericPrice = parseInt(price.replace(/[^0-9]/g, ''), 10);

    return {
      url,
      platform: 'amazon',
      title,
      price: numericPrice,
      image: imageUrls[0] || '',
      priceHistory: [],
      outOfStock,
      lowestPrice: numericPrice,
      highestPrice: numericPrice,
      averagePrice: numericPrice,
    };
  } catch (e) {
    console.error('Scraping Error:', e.message);
    throw e;
  }
}

module.exports = { scrapeAmazonProduct };
