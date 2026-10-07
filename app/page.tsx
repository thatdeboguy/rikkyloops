import Image from "next/image";
import Link from "next/link";
import { CategoryGrid, ProductCard } from "@/components/catalog";
import { getProducts } from "@/lib/catalog";
import { getContent } from "@/lib/content";
export const dynamic = "force-dynamic";
export default async function Home() {
  const [products, content] = await Promise.all([getProducts(), getContent()]);
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">{content.heroEyebrow}</span>
          <h1 className="content-text">{content.heroTitle}</h1>
          <p>{content.heroDescription}</p>
          <Link href="/shop" className="button">
            Find your favourite <span>↗</span>
          </Link>
          <div className="hero-bottom">
            <span className="loop-mark">❋</span>
            <span>
              Made slowly.
              <br />
              <strong>Loved for a long time.</strong>
            </span>
          </div>
        </div>
        <div className="hero-image">
          <Image
            src={content.heroImage || "/images/hero.webp"}
            alt="A woman wearing a cream crochet dress in a sunlit garden"
            fill
            priority
            sizes="(max-width: 700px) 100vw, 58vw"
          />
          <div className="handmade-seal">
            100%<span>HANDMADE</span>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A LITTLE SOMETHING FOR EVERY YOU</span>
            <h2>Find your kind of lovely.</h2>
          </div>
        </div>
        <CategoryGrid content={content} />
      </section>
      <section className="section featured">
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR NEXT WARDROBE FAVOURITES</span>
            <h2>Love at first loop.</h2>
          </div>
          <Link className="text-link" href="/shop">
            Shop all pieces ↗
          </Link>
        </div>
        <div className="product-grid">
          {products.slice(0, 4).map((p) => (
            <ProductCard product={p} showCategory={false} key={p.id} />
          ))}
        </div>
      </section>
      <section id="custom-design" className="story">
        <div className="story-art">
          <Image
            src={content.storyImage || "/images/sweater.webp"}
            alt="Handmade crochet details that can inspire a custom dress"
            fill
            sizes="(max-width: 700px) 100vw, 50vw"
          />
          <span>Dream it. We’ll make it by hand.</span>
        </div>
        <div className="story-copy">
          <span className="eyebrow">A DRESS MADE FROM YOUR IDEA</span>
          <h2>Have something special in mind?</h2>
          <p>
            Share a picture of the dress you love and tell us where it needs to
            go. We’ll get in touch to discuss measurements, colours, timing,
            and all the thoughtful details that will make it yours.
          </p>
          <Link className="text-link" href="/custom-design">
            Let’s make something personal ↗
          </Link>
        </div>
      </section>
      <section className="closing">
        <span className="eyebrow">SOMETHING UNIQUELY YOURS</span>
        <h2>{content.closingTitle}</h2>
        <p className="content-text">{content.closingText}</p>
        <Link href="/contact" className="button">
          Talk to us ↗
        </Link>
      </section>
    </>
  );
}
