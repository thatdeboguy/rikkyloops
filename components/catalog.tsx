import { defaultContent, type SiteContent } from "@/lib/content";
import { Price } from "@/components/currency";
import Image from "next/image";
import Link from "next/link";
import { categories, type Product } from "@/lib/catalog";
export function ProductCard({
  product,
  showCategory = true,
}: {
  product: Product;
  showCategory?: boolean;
}) {
  return (
    <article className="group min-w-0">
      <Link href={`/shop/${product.id}`} className="relative block aspect-3/4 overflow-hidden rounded-2xl bg-[var(--rose)] [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-500 motion-safe:group-hover:[&_img]:scale-105">
        <Image
          src={product.image || "/images/placeholder.svg"}
          unoptimized={product.image.startsWith("https://")}
          alt={`${product.name} in ${product.color}`}
          fill
          sizes="(max-width: 600px) 46vw, (max-width: 900px) 30vw, 25vw"
        />
        <span className="absolute inset-x-3 bottom-3 rounded-xl bg-white/95 p-3 text-center text-[var(--ink)] shadow-sm transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">Discover this piece</span>
      </Link>
      <div className="mt-4 mb-2 flex flex-wrap justify-between gap-1 text-xs text-[var(--muted)]">
        {showCategory && <span>{product.category}</span>}
        <span>{product.color}</span>
      </div>
      <div className="flex flex-col justify-between gap-1 xl:flex-row xl:items-baseline [&_h3]:m-0 [&_h3]:text-base [&>span]:whitespace-nowrap [&>span]:font-medium">
        <Link href={`/shop/${product.id}`}>
          <h3 className="mt-4! mb-0! text-base!">{product.name}</h3>
        </Link>
        <span>
          <Price product={product} />
        </span>
      </div>
      <p className="mt-2 text-xs! text-[var(--muted)]">{product.sizes.join(" · ")}</p>
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
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
      {categories.map((name, i) => (
        <Link
          href={`/shop?category=${encodeURIComponent(name)}`}
          className="group min-w-0"
          key={name}
        >
          <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-[var(--rose)] [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-500 motion-safe:group-hover:[&_img]:scale-105">
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
