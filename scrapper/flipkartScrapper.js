const puppeteer = require('puppeteer');

async function scrapeFlipkartProduct(url) {
    if (!url) return;

    const browser = await puppeteer.launch({
        headless: 'new', 
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-features=IsolateOrigins,site-per-process'
        ]
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });

        const data = await page.evaluate((url) => {
            const title = document.querySelector(".VU-ZEz")?.innerText.trim() || "N/A";
            const priceText = document.querySelector(".Nx9bqj.CxhGGd")?.innerText.replace(/₹|,/g, "").trim() || "0";
            const price = parseInt(priceText, 10);
            const outOfStock = document.querySelector(".QqFHMw.AMnSvF.v6sqKe")?.innerText.toLowerCase().trim() === "notify me";
            const imageUrl = document.querySelector("img.DByuf4.IZexXJ.jLEJ7H")?.src || document.querySelector("img._53J4C-.utBuJY")?.src || "";
            const description = document.querySelector(".yN+eNk")?.innerText.trim() || document.querySelector(".yN+eNk.w9jEaj")?.innerText.trim() || document.querySelector("._4aGEkW")?.innerText.trim() || "N/A"; 
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
        await browser.close();
    }
}
module.exports = { scrapeFlipkartProduct };
