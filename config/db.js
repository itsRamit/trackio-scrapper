require('dotenv').config({ path: './.env' }); 
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGO_URI;

async function connectToDB(){
    console.log('Attempting to connect to the database...');

    if(!MONGODB_URI) return;
    try {
        await mongoose.connect(MONGODB_URI).then(()=>{console.log("Mongoose server has started")
        })
        .catch((err)=>{
            console.error(err)
        });
        // console.log('MongoDB Connected');
    } catch (error) {
        throw error;
    }
}
module.exports = {connectToDB};

