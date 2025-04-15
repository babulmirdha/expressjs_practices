const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");
const ProductCategory = require("../models/productCategory");


// POST: assign a product under multiple categories
router.post("/:productId/categories", async (req, res) => {
  const { categories } = req.body;

  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let results = [];

    for (const categoryId of categories) {
      const existingCategory = await Category.findById(categoryId);
      if (!existingCategory) {
        return res.status(404).json({ message: `Category not found: ${categoryId}` });
      }

      const alreadyAssigned = await ProductCategory.findOne({
        product: product._id,
        category: categoryId,
      });

      if (alreadyAssigned) {
        return res.status(400).json({ message: `Product already assigned to category: ${categoryId}` });
      }

      const newProductCategory = new ProductCategory({
        product: product._id,
        category: categoryId,
      });

      const saved = await newProductCategory.save();
      results.push(saved);
    }

    res.status(201).json({
      message: "Categories assigned to product",
      product: product._id,
      categories: results,
    });

  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// GET: Get all categories of a product
router.get("/:productId/categories", async (req, res) => {
  try {
    const products = await ProductCategory.find({product: req.params.productId}).populate("category product");
    if (products.length === 0) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// PUT: Replace all categories of a product
router.put("/:productId/categories", async (req, res) => {
  const { categoryIds } = req.body; // expects array

  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Optionally remove product ref from old categories
    const oldCategories = await Category.find({ _id: { $in: product.categories } });
    for (const cat of oldCategories) {
      cat.products.pull(product._id);
      await cat.save();
    }

    // Update product's categories
    product.categories = categoryIds;
    await product.save();

    // Add product to each category
    const newCategories = await Category.find({ _id: { $in: categoryIds } });
    for (const cat of newCategories) {
      if (!cat.products.includes(product._id)) {
        cat.products.push(product._id);
        await cat.save();
      }
    }

    const updatedProduct = await Product.findById(req.params.productId).populate("categories");

    res.status(200).json({ message: "Product categories updated", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE: Remove a specific category from a product
router.delete("/:productId/categories/:categoryId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const category = await Category.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    product.categories.pull(req.params.categoryId);
    await product.save();

    category.products.pull(product._id);
    await category.save();

    const updatedProduct = await Product.findById(req.params.productId).populate("categories");

    res.status(200).json({ message: "Category removed from product", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
