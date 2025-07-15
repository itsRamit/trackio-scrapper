const express = require("express");
require("dotenv").config({ path: "./.env" });
const { connectToDB } = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");
const { updateProductPrices } = require("./cron/cronJobs");

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: "https://www.trackio.me", // Add dev origin too if needed
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check route (important for Azure)
app.get("/", (req, res) => {
  res.send("Trackio backend is running!");
});

connectToDB()
  .then(() => {
    console.log("✅ Database connected, starting the server...");

    // API routes
    app.use("/api", productRoutes);

    // Start server with 0.0.0.0 to work on Azure
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // Run scheduled price update
    updateProductPrices()
      .then(() => console.log("🔄 Initial price update completed"))
      .catch((err) => console.error("❌ Initial price update failed:", err));
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database. Server will not start.", err);
    process.exit(1);
  });
