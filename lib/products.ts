import productData from "@/data/products.json";
import { getMongoDb, hasMongoConfig } from "./mongodb";

export type Product = {
  slug: string;
  name: string;
  category: string;
  collection: string;
  designer: string;
  price: number;
  currency: "GBP";
  image: string;
  gallery: string[];
  description: string;
  materials: string[];
  finish: string;
  dimensions: string;
  leadTime: string;
  featured: boolean;
  inventory: number;
};

export async function getProducts(): Promise<Product[]> {
  if (!hasMongoConfig()) {
    return productData as Product[];
  }

  try {
    const db = await getMongoDb();
    const products = await db
      .collection<Product>("products")
      .find({}, { projection: { _id: 0 } })
      .sort({ featured: -1, name: 1 })
      .toArray();

    return products.length ? products : (productData as Product[]);
  } catch (error) {
    console.error("Falling back to local product JSON", error);
    return productData as Product[];
  }
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}
