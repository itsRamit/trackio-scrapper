require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGO_URI;

async function connectToDB() {
    console.log('Attempting to connect to the database...');

    if (!MONGODB_URI) {
        console.error('MONGO_URI is not defined in the environment variables.');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout
            socketTimeoutMS: 45000, // 45 seconds socket timeout
        });

        console.log('MongoDB Connected Successfully.');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1);
    }

    // Handle reconnection on disconnect
    mongoose.connection.on('disconnected', () => {
        console.error('MongoDB disconnected! Attempting to reconnect...');
        connectToDB();
    });
}

module.exports = { connectToDB };
