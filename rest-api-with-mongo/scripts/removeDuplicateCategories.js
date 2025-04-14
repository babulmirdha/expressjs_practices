const mongoose = require("mongoose");
const Category = require("../models/Category");

const uri = "mongodb://localhost:27017/your_db_name"; // Update your DB name

async function removeDuplicateCategories() {
  await mongoose.connect(uri);

  const duplicates = await Category.aggregate([
    {
      $group: {
        _id: { name: "$name" },
        ids: { $addToSet: "$_id" },
        count: { $sum: 1 }
      }
    },
    { $match: { count: { $gt: 1 } } }
  ]);

  for (const dup of duplicates) {
    const [keepId, ...deleteIds] = dup.ids;
    await Category.deleteMany({ _id: { $in: deleteIds } });
    console.log(`Kept ${keepId}, removed duplicates: ${deleteIds.join(", ")}`);
  }

  // Rebuild unique index
  await Category.collection.createIndex({ name: 1 }, { unique: true });
  console.log("✅ Unique index rebuilt.");

  await mongoose.disconnect();
}

removeDuplicateCategories();
