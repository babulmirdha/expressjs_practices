// routes/products.js
const express = require("express");
const router = express.Router();
const { Product } = require("../models"); // Adjust the path based on your structure
const ProductCategory = require("../models/productCategory");

// 📌 Create a Product
router.post("/", async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const newProduct = new Product({ name, price, description });
    const savedProduct = await newProduct.save();

    const existingProductCategory = await ProductCategory.findOne({ product: "67fea88a0f5f220ad141c46c", category });

    if (existingProductCategory) {
      return res.status(400).json({ status: "error", message: "Product already exists in this category" });
    }

    const productCategory = new ProductCategory({
      product: newProduct._id,
      category
    })
    await productCategory.save(); // Save the product-category relationship
    res.status(201).json({
      status: "success",
      message: "Product added",
      data: {savedProduct, productCategory},
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 📌 Read All Products with Categories
router.get("/product-category", async (req, res) => {
  try {
    //const products = await ProductCategory.find().populate('category product'); // Populate categories with their names

    const products = await ProductCategory.find().populate('category', 'name description').populate('product', 'name'); // Populate categories with their names
    res.json({
      status: "success",
      message: "Products retrieved",
      data: products,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 📌 Read All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate('categories', 'name description'); // Populate categories with their names
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
