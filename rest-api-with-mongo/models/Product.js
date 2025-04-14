// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // ✅ Enforce uniqueness
    trim: true
  },
  price: mongoose.Schema.Types.Decimal128,
  description: String,
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }]
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;



// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   price: mongoose.Schema.Types.Decimal128,
//   description: String,
//   category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // relational reference
// });

// const Product = mongoose.model("Product", productSchema);
// module.exports = Product;
