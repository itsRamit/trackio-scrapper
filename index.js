const express = require('express');
const { connectToDB } = require('./config/db');
const productRoutes = require('./routes/productRoutes');
require('./cron/cronJobs');

const app = express();
const PORT = 3001;

// Middlewares
app.use(express.json());

// Connect to DB
connectToDB();

// Routes
app.use('/api', productRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
