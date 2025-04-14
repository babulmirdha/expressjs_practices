require('dotenv').config();

const mongoose = require('mongoose');
const Category = require('./models/Category'); // your category model

async function ensureIndex() {

  console.log(process.env.MONGO_URI);
  

  await mongoose.connect(process.env.MONGO_URI);
  await Category.collection.createIndex({ name: 1 }, { unique: true });
  console.log("Unique index on 'name' created.");
  mongoose.disconnect();
}

ensureIndex();
