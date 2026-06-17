import { MongoClient } from "mongodb";
import products from "../data/products.json" with { type: "json" };

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "custome_furniture";

if (!uri) {
  console.error("Missing MONGODB_URI. Run: MONGODB_URI='...' npm run seed");
  process.exit(1);
}

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("products");

  await collection.createIndex({ slug: 1 }, { unique: true });

  const operations = products.map((product) => ({
    updateOne: {
      filter: { slug: product.slug },
      update: {
        $set: {
          ...product,
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      upsert: true
    }
  }));

  const result = await collection.bulkWrite(operations);
  console.log(
    `Seeded ${products.length} products into ${dbName}.products`,
    JSON.stringify(
      {
        inserted: result.upsertedCount,
        matched: result.matchedCount,
        modified: result.modifiedCount
      },
      null,
      2
    )
  );
} finally {
  await client.close();
}
