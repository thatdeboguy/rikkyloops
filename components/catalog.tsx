import { defaultContent, type SiteContent } from "@/lib/content";
import { Price } from "@/components/currency";
import Image from "next/image";
import Link from "next/link";
import { categories, type Product } from "@/lib/catalog";
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link href={`/shop/${product.id}`} className="product-image">
        <Image
          src={product.image || "/images/placeholder.svg"}
          unoptimized={product.image.startsWith("https://")}
          alt={`${product.name} in ${product.color}`}
          fill
          sizes="(max-width: 600px) 46vw, (max-width: 900px) 30vw, 25vw"
        />
        <span className="product-cta">Discover this piece</span>
      </Link>
      <div className="product-meta">
        <span>{product.category}</span>
        <span>{product.color}</span>
      </div>
      <div className="product-name">
        <Link href={`/shop/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <span>
          <Price product={product} />
        </span>
      </div>
      <p className="product-sizes">{product.sizes.join(" · ")}</p>
    </article>
  );
}
export function CategoryGrid({
  content = defaultContent,
}: {
  content?: SiteContent;
}) {
  const images = [
    content.dressImage,
    content.topImage,
    content.sweaterImage,
    content.bagImage,
    content.hatImage,
  ];
  return (
    <div className="category-grid">
      {categories.map((name, i) => (
        <Link
          href={`/shop?category=${encodeURIComponent(name)}`}
          className="category-card"
          key={name}
        >
          <div className="category-image">
            <Image
              src={images[i] || "/images/placeholder.svg"}
              alt={`Explore crochet ${name.toLowerCase()}`}
              fill
              sizes="(max-width: 600px) 46vw, 20vw"
            />
          </div>
          <h3>
            {name === "Bags and accessories" ? "Bags & accessories" : name}
          </h3>
        </Link>
      ))}
    </div>
  );
}
