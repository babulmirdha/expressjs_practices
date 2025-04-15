const express = require("express");
const mongoose = require("./db"); // MongoDB connection
const customerRoutes = require("./routes/customers"); 
const productsRoutes = require("./routes/products"); 
const categoriesRoutes = require("./routes/categories"); 
const prooductCategoriesRoutes = require("./routes/product_category"); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // To parse JSON bodies

// Routes
app.use("/api/customers", customerRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/products", prooductCategoriesRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
