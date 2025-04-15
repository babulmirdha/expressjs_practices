const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

// 📌 Create a Customer
router.post("/", async (req, res) => {
  try {
    const { name, address, mobile, email } = req.body;

    const customer = new Customer({ name, address, mobile, email });
    const saved = await customer.save();

    res.status(201).json({
      status: "success",
      message: "Customer added",
      data: saved,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 📌 Get All Customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json({
      status: "success",
      message: "Customers retrieved",
      data: customers,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 📌 Get Single Customer by ID
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ status: "error", message: "Customer not found" });
    }
    res.json({
      status: "success",
      message: "Customer retrieved",
      data: customer,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 📌 Update a Customer
router.put("/:id", async (req, res) => {
  try {
    const { name, address, mobile, email } = req.body;

    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, address, mobile, email },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ status: "error", message: "Customer not found" });
    }

    res.json({
      status: "success",
      message: "Customer updated",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 📌 Delete a Customer
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ status: "error", message: "Customer not found" });
    }

    res.json({ status: "success", message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
