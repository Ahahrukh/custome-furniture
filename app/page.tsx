import { Storefront } from "@/components/storefront";
import { getProducts } from "@/lib/products";

export default async function Home() {
  const products = await getProducts();

  return <Storefront products={products} />;
}
