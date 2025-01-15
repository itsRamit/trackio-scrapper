const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    url: {type: String, require: true, unique: true},
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
        {email: {type:String, required: true}}
    ], default: [],

}, {timestamps: true});

const Product = mongoose.models.Product || mongoose.model('Product',productSchema);
module.exports = Product;