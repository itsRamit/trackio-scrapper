const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    url: {type: String, required: true, unique: true},
    platform: {type: String, required: true},
    image: {type: String, required: true},
    title: {type: String, required: true},
    price: {type: Number, required: true},
    priceHistory: [
        {
            price: {type: Number, required: true},
            date: {type: Date, default: Date.now},
        },
    ],
    lowestPrice: {type: Number},
    highestPrice: {type: Number},
    averagePrice: {type: Number},
    isOutOfStock: {type: Boolean, default: false},
    users: [
        {
            email: {type: String, required: true},
            targetPrice: {type: Number, required: false},
        }
    ],
}, {timestamps: true});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
module.exports = {Product};
