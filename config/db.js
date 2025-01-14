require('dotenv').config({ path: '../.env' }); 
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGO_URI;

async function connectToDB(){
    if(!MONGODB_URI) return;
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        throw error;
    }
}
module.exports = {connectToDB};

