const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Product = require("../models/Product");

// // 📌 Create a Category
// router.post("/", async (req, res) => {
//   try {
//     const { name, description } = req.body;
//     const category = new Category({ name, description });
//     const saved = await category.save();
//     res.status(201).json({
//       status: "success",
//       message: "Category added",
//       data: saved,
//     });
//   } catch (err) {
//     res.status(500).json({ status: "error", message: err.message });
//   }
// });

// POST: Create a new category
router.post("/", async (req, res) => {
  const { name, description } = req.body;

  try {

    // Check if name is provided
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Category name is required." });
    }

    // check if existing category name

    // const existing = await Category.findOne({ name: name.trim() });
    // if (existing) {
    //   return res.status(409).json({ message: "Category name must be unique." });
    // }

    const category = new Category({ name, description });
    await category.save();
    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Category name must be unique." });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 📌 Read All Categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({
      status: "success",
      message: "Categories retrieved",
      data: categories,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 📌 Read Single Category
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ status: "error", message: "Category not found" });
    }
    res.json({
      status: "success",
      message: "Category retrieved",
      data: category,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 📌 Update Category
router.put("/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ status: "error", message: "Category not found" });
    }

    res.json({
      status: "success",
      message: "Category updated",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 📌 Delete Category
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ status: "error", message: "Category not found" });
    }
    res.json({ status: "success", message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 📌 Get Products by Category ID
router.get("/:id/products", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.id });
    res.json({
      status: "success",
      message: "Products by category ID",
      data: products,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
