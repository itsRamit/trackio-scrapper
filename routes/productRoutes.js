const express = require('express');
const { scrapeAndStoreProduct, scrapeProduct } = require('../controller/productController');
const router = express.Router();

router.post('/scrape-product', scrapeAndStoreProduct);
router.get('/get-product', scrapeProduct);
module.exports = router;
