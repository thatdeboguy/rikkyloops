import { PageHeading } from "@/components/section-heading";
import { getContent } from "@/lib/content";
import { CategoryGrid } from "@/components/catalog";
export const metadata = { title: "Categories" };
export default async function Categories() {
  const content = await getContent();
  return (
    <>
      <PageHeading
        eyebrow="FIND YOUR KIND OF LOVELY"
        title="Made for every mood."
        description="From sun-ready dresses to the finishing touches. Explore your favourite kind of crochet."
      />
      <section className="section">
        <CategoryGrid content={content} />
      </section>
    </>
  );
}
