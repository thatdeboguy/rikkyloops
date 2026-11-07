import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import Link from "next/link";
import { CategoryGrid, ProductCard } from "@/components/catalog";
import { getProducts } from "@/lib/catalog";
import { getContent } from "@/lib/content";
export const dynamic = "force-dynamic";
export default async function Home() {
  const [products, content] = await Promise.all([getProducts(), getContent()]);
  return (
    <>
      <section className="mx-auto grid max-w-384 gap-6 px-5 py-6 md:grid-cols-2 md:px-10 lg:px-16">
        <div className="flex flex-col items-start justify-center rounded-3xl bg-[#fce8f0] px-7 py-12 sm:px-12 lg:py-20">
          <span className="eyebrow">{content.heroEyebrow}</span>
          <h1 className="whitespace-pre-line text-[clamp(3.5rem,6.5vw,6rem)]! leading-[1.02]! tracking-[-0.055em]!">{content.heroTitle}</h1>
          <p className="mb-8! max-w-sm leading-7!">{content.heroDescription}</p>
          <Link href="/shop" className="button rounded-full! px-7! shadow-sm hover:-translate-y-0.5 motion-reduce:transform-none">
            Find your favourite <span>↗</span>
          </Link>
          <div className="mt-9 flex items-center gap-4 border-t border-[#e5bfd0] pt-6 text-muted">
            <span className="loop-mark">❋</span>
            <span>
              Made slowly.
              <br />
              <strong>Loved for a long time.</strong>
            </span>
          </div>
        </div>
        <div className="relative min-h-100 overflow-hidden rounded-3xl md:min-h-145 [&>img]:object-cover [&>img]:object-[66%_center]">
          <Image
            src={content.heroImage || "/images/hero.webp"}
            alt="A woman wearing a cream crochet dress in a sunlit garden"
            fill
            priority
            sizes="(max-width: 767px) 100vw, 50vw"
          />
          <div className="handmade-seal">
            100%<span>HANDMADE</span>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-384 px-5 py-14 md:px-10 lg:px-16 lg:py-20">
        <SectionHeading eyebrow="A LITTLE SOMETHING FOR EVERY YOU" title="Find your kind of lovely." />
        <CategoryGrid content={content} />
      </section>
      <section className="mx-auto max-w-384 px-5 pb-16 md:px-10 lg:px-16 lg:pb-24">
        <SectionHeading eyebrow="YOUR NEXT WARDROBE FAVOURITES" title="Love at first loop."><Link className="text-link" href="/shop">
            Shop all pieces ↗
          </Link></SectionHeading>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-6">
          {products.slice(0, 4).map((p) => (
            <ProductCard product={p} showCategory={false} key={p.id} />
          ))}
        </div>
      </section>
      <section id="custom-design" className="mx-5 grid overflow-hidden rounded-3xl bg-[#fce8f0] md:mx-10 md:grid-cols-2 lg:mx-16">
        <div className="story-art">
          <Image
            src={content.storyImage || "/images/sweater.webp"}
            alt="Handmade crochet details that can inspire a custom dress"
            fill
            sizes="(max-width: 700px) 100vw, 50vw"
          />
          <span>Dream it. We’ll make it by hand.</span>
        </div>
        <div className="flex flex-col items-start justify-center px-7 py-12 sm:px-12 lg:px-16 [&>p]:leading-7">
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
      <section className="px-6 py-20 text-center lg:py-28 [&>p]:mx-auto [&>p]:max-w-xl [&>p]:leading-7">
        <span className="eyebrow">SOMETHING UNIQUELY YOURS</span>
        <h2>{content.closingTitle}</h2>
        <p className="content-text">{content.closingText}</p>
        <Link href="/contact" className="button rounded-full! px-7! shadow-sm hover:-translate-y-0.5 motion-reduce:transform-none">
          Talk to us ↗
        </Link>
      </section>
    </>
  );
}
