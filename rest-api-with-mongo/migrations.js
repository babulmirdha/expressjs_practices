const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ecommerce_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Categories Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});

// Products Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: mongoose.Schema.Types.Decimal128, required: true },
  description: { type: String },
});

// Product-Categories Pivot Schema
const productCategorySchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
}, {
  indexes: [{ unique: true, fields: ['product_id', 'category_id'] }]
});

// Customers Schema
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  address: { type: String },
});

// Orders Schema
const orderSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  order_date: { type: Date, default: Date.now },
  total_price: { type: mongoose.Schema.Types.Decimal128, required: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'canceled'],
    default: 'pending',
  },
});

// Order Items Schema
const orderItemSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: mongoose.Schema.Types.Decimal128, required: true },
}, {
  indexes: [{ unique: true, fields: ['order_id', 'product_id'] }]
});

// Create Models
const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);
const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);
const Customer = mongoose.model('Customer', customerSchema);
const Order = mongoose.model('Order', orderSchema);
const OrderItem = mongoose.model('OrderItem', orderItemSchema);

// Export models
module.exports = {
  Category,
  Product,
  ProductCategory,
  Customer,
  Order,
  OrderItem,
};
