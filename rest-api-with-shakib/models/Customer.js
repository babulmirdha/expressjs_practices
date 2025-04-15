const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  mobile: String,
  email: String,
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
