const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeFlipkartProduct(url) {
  if (!url) return;

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      },
    });

    const $ = cheerio.load(html);

    const title = $(".VU-ZEz").text().trim() || "N/A";

    const priceText = $(".Nx9bqj.CxhGGd").text().replace(/₹|,/g, "").trim() || "0";
    const price = parseInt(priceText, 10);

    const outOfStock = $(".QqFHMw.AMnSvF.v6sqKe").text().toLowerCase().trim() === "notify me";

    const imageUrl =
      $("img.DByuf4.IZexXJ.jLEJ7H").attr("src") ||
      $("img._53J4C-.utBuJY").attr("src") ||
      "";

    const description =
      $(".yN+eNk").text().trim() ||
      $(".yN+eNk.w9jEaj").text().trim() ||
      $("._4aGEkW").text().trim() ||
      "N/A";

    const result = {
      url,
      platform: "flipkart",
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

    console.log(result);
    return result;
  } catch (error) {
    console.error("Scraping Error:", error.message);
    throw error;
  }
}

module.exports = { scrapeFlipkartProduct };
