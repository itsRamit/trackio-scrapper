const express = require("express");
require('dotenv').config({ path: './.env' }); 
const { connectToDB } = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const cors = require('cors');
require("./cron/cronJobs");

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: "http://127.0.0.1:5500",
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));

app.use(express.json());

connectToDB();
app.use("/api", productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

