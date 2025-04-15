To convert your MySQL-based table creation logic into MongoDB using Mongoose (a popular ODM for MongoDB in Node.js), you'll need to define Mongoose **schemas and models** instead of SQL table creation queries.

Here's the equivalent **MongoDB (Mongoose)** version of your SQL schema setup:

```js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/your_database_name', {
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
```

### Notes:
- `mongoose.Schema.Types.Decimal128` is used to mimic SQL's `DECIMAL(10,2)` for currency values.
- MongoDB does not enforce foreign keys, but using `ref` with `ObjectId` creates a relationship that's useful when using `.populate()`.
- You should handle uniqueness in the application or with MongoDB's unique index (`unique: true`).
- The `product_categories` table is modeled as a separate collection in MongoDB (though in many cases, it might be better to embed category IDs directly in the product document if your use case allows).

Let me know if you want to embed the relationships instead of using references, or if you're planning to seed some initial data.