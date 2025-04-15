const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");


// POST: Assign a category to a product (add to array)
router.post("/:productId/categories", async (req, res) => {
  const { categoryId } = req.body;

  try {
    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Add category if not already assigned
    if (!product.categories.includes(categoryId)) {
      product.categories.push(categoryId);
      await product.save();
    }

    // Sync reverse (optional)
    if (!category.products.includes(product._id)) {
      category.products.push(product._id);
      await category.save();
    }

    const updatedProduct = await Product.findById(req.params.productId).populate("categories");

    res.status(200).json({ message: "Category assigned to product", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET: Get all categories of a product
router.get("/:productId/categories", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate("categories");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ categories: product.categories });
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
