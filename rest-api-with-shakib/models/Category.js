const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    unique: true, // ✅ This is enough — remove the .index() call below
  },
  description: {
    type: String,
    trim: true,
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
}, { timestamps: true });

// ❌ REMOVE THIS to avoid duplicate index warning
// categorySchema.index({ name: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;

// const categorySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Name is required"],
//     trim: true,
//   },
//   description: {
//     type: String,
//     trim: true,
//   },
// }, { timestamps: true });

// module.exports = mongoose.model("Category", categorySchema);
