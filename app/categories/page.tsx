import { getContent } from "@/lib/content";
import { CategoryGrid } from "@/components/catalog";
export const metadata = { title: "Categories" };
export default async function Categories() {
  const content = await getContent();
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">FIND YOUR KIND OF LOVELY</span>
        <h1>Made for every mood.</h1>
        <p>
          From sun-ready dresses to the finishing touches. Explore your
          favourite kind of crochet.
        </p>
      </div>
      <section className="section">
        <CategoryGrid content={content} />
      </section>
    </>
  );
}
