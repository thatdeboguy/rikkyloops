import { PageHeading } from "@/components/section-heading";
import Link from "next/link";
import { getContent } from "@/lib/content";
export const metadata = { title: "Return policy" };
export default async function Returns() {
  const content = await getContent();
  return (
    <>
      <PageHeading
        eyebrow="HERE TO HELP"
        title={content.returnsTitle}
        description="A little clarity, so you can choose with confidence."
      />
      <article className="prose rounded-2xl border border-line bg-white py-8 shadow-sm sm:px-10">
        <p className="content-text">{content.returnsText}</p>
        <Link className="text-link" href="/contact">
          Questions? Get in touch ↗
        </Link>
      </article>
    </>
  );
}
