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

        const title = await page.$eval('.VU-ZEz', el => el.innerText.trim());
        const price = await page.$eval('.Nx9bqj.CxhGGd', el => el.innerText.trim().replace(/₹|,/g, ''));
        const outOfStock = await page.$eval(".QqFHMw.AMnSvF.v6sqKe", el => el.innerText.trim().toLowerCase() === 'notify me');
        const imageUrl = await page.$eval('img.DByuf4.IZexXJ.jLEJ7H', img => img.src);
        const data = {
            url,
            platform: "flipkart",
            title,
            price: parseInt(price, 10),
            image: imageUrl,
            priceHistory: [],
            outOfStock,
            lowestPrice: parseInt(price, 10),
            highestPrice: parseInt(price, 10),
            averagePrice: parseInt(price, 10),
        };

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
