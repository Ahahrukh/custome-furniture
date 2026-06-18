import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Tecton, ShieldCheck, Truck } from "lucide-react";
import { ProductActions } from "@/components/product-actions";
import { getProductBySlug } from "@/lib/products";

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="detail-shell">
      <Link className="back-link" href="/">
        <ArrowLeft size={18} />
        Collection
      </Link>

      <section className="detail-grid">
        <div className="detail-media">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 900px) 100vw, 55vw"
            priority
          />
        </div>

        <div className="detail-copy">
          <p className="eyebrow">{product.collection} collection</p>
          <h1>{product.name}</h1>
          <p className="designer">{product.designer}</p>
          <p className="detail-description">{product.description}</p>

          <div className="price-line">
            <span>Project estimate GBP {product.price.toLocaleString("en-GB")}</span>
            <small>{product.leadTime}</small>
          </div>

          <ProductActions product={product} />

          <div className="spec-list">
            <div>
              <Tecton size={19} />
              <span>{product.materials.join(", ")}</span>
            </div>
            <div>
              <ShieldCheck size={19} />
              <span>{product.finish}</span>
            </div>
            <div>
              <Truck size={19} />
              <span>White-glove delivery and installation available</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
