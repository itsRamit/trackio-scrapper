const express = require('express');
const { scrapeAndStoreProduct } = require('../controller/productController');
const router = express.Router();

router.post('/scrape-product', scrapeAndStoreProduct);
module.exports = router;
