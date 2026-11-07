import { cookies } from "next/headers";
import { isCurrency, productPrice } from "@/lib/currency";
import Link from "next/link";
import { ProductCard } from "@/components/catalog";
import { categories, getProducts } from "@/lib/catalog";
export const metadata = { title: "Shop" };
export const dynamic = "force-dynamic";
export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const savedCurrency = (await cookies()).get("rikkyloops_currency")?.value;
  const currency = isCurrency(savedCurrency) ? savedCurrency : "NGN";
  const category = typeof params.category === "string" ? params.category : "";
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const sort = typeof params.sort === "string" ? params.sort : "featured";
  let products = (await getProducts()).filter(
    (p) =>
      (!category || p.category === category) &&
      `${p.name} ${p.category} ${p.color}`
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  if (sort === "price-low")
    products = products.sort(
      (a, b) =>
        (productPrice(a, currency) ?? Infinity) -
        (productPrice(b, currency) ?? Infinity),
    );
  if (sort === "price-high")
    products = products.sort(
      (a, b) =>
        (productPrice(b, currency) ?? -Infinity) -
        (productPrice(a, currency) ?? -Infinity),
    );
  return (
    <>
      <h1 className="sr-only">{category || "The collection"}</h1>
      <section className="shop-content mx-auto max-w-384">
        <div className="filters rounded-2xl bg-white p-3 shadow-sm">
          <Link className={`chip ${!category ? "active" : ""}`} href="/shop">
            All pieces
          </Link>
          {categories.map((c) => (
            <Link
              className={`chip ${c === category ? "active" : ""}`}
              key={c}
              href={`/shop?category=${encodeURIComponent(c)}`}
            >
              {c}
            </Link>
          ))}
        </div>
        <div className="shop-controls [&_form]:flex-wrap [&_form]:gap-3 [&_input]:min-w-0">
          <p>
            {products.length} {products.length === 1 ? "piece" : "pieces"}
            {q ? ` matching “${q}”` : " to make your own"}
          </p>
          <form action="/shop">
            {category && (
              <input type="hidden" name="category" value={category} />
            )}
            <input
              aria-label="Search products"
              name="q"
              placeholder="Search the collection"
              defaultValue={q}
            />
            <select aria-label="Sort products" name="sort" defaultValue={sort}>
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
            <button className="button">Apply</button>
          </form>
        </div>
        {products.length ? (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h2>No pieces found just yet.</h2>
            <p>Try another search or explore the full collection.</p>
            <Link href="/shop" className="text-link">
              View all pieces →
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
