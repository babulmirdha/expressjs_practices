// routes/products.js
const express = require("express");
const router = express.Router();
const { Product } = require("../models"); // Adjust the path based on your structure

// 📌 Create a Product
router.post("/", async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const newProduct = new Product({ name, price, description });
    const savedProduct = await newProduct.save();
    res.status(201).json({
      status: "success",
      message: "Product added",
      data: savedProduct,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 📌 Read All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      status: "success",
      message: "Products retrieved",
      data: products,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 📌 Read Single Product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }
    res.json({
      status: "success",
      message: "Product retrieved",
      data: product,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 📌 Update a Product
router.put("/:id", async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }
    res.json({
      status: "success",
      message: "Product updated",
      data: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 📌 Delete a Product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }
    res.json({ status: "success", message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
