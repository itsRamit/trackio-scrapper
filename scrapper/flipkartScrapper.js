const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

async function scrapeFlipkartProduct(url) {
  if (!url) return;

  let browser;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath || '/usr/bin/chromium-browser', // fallback for local dev
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    );

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    const data = await page.evaluate((url) => {
      const title = document.querySelector(".VU-ZEz")?.innerText.trim() || "N/A";
      const priceText = document.querySelector(".Nx9bqj.CxhGGd")?.innerText.replace(/₹|,/g, "").trim() || "0";
      const price = parseInt(priceText, 10);
      const outOfStock = document.querySelector(".QqFHMw.AMnSvF.v6sqKe")?.innerText.toLowerCase().trim() === "notify me";
      const imageUrl = document.querySelector("img.DByuf4.IZexXJ.jLEJ7H")?.src || document.querySelector("img._53J4C-.utBuJY")?.src || "";
      const description = document.querySelector(".yN+eNk")?.innerText.trim()
        || document.querySelector(".yN+eNk.w9jEaj")?.innerText.trim()
        || document.querySelector("._4aGEkW")?.innerText.trim() || "N/A";

      return {
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
    }, url);

    console.log(data);
    return data;
  } catch (error) {
    console.error("Scraping Error:", error.message);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { scrapeFlipkartProduct };
