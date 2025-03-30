const express = require("express");
require("dotenv").config({ path: "./.env" });
const { connectToDB } = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");
const { updateProductPrices } = require("./cron/cronJobs"); // Ensure correct import

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: "https://www.trackio.me",
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());

connectToDB().then(() => {
    console.log("Database connected, starting the server...");
  
    app.use("/api", productRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    updateProductPrices();
  })
  .catch((err) => {
    console.error("Failed to connect to database. Server will not start.", err);
    process.exit(1);
  });
