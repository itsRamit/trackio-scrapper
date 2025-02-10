const express = require("express");
const cors = require("cors");
const { connectToDB } = require("./config/db");
const productRoutes = require("./routes/productRoutes");
require("./cron/cronJobs");

const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

connectToDB();
app.use("/api", productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
