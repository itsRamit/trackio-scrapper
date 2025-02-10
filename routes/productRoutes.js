const express = require('express');
const { scrapeAndStoreProduct, scrapeProduct } = require('../controller/productController');
const router = express.Router();

router.post('/track-product', scrapeAndStoreProduct);
router.post('/scrape-product', scrapeProduct);
module.exports = router;
