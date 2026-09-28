import Link from "next/link";
import { getContent } from "@/lib/content";
export const metadata = { title: "Return policy" };
export default async function Returns() {
  const content = await getContent();
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">HERE TO HELP</span>
        <h1>{content.returnsTitle}</h1>
        <p>A little clarity, so you can choose with confidence.</p>
      </div>
      <article className="prose">
        <p className="content-text">{content.returnsText}</p>
        <Link className="text-link" href="/contact">
          Questions? Get in touch ↗
        </Link>
      </article>
    </>
  );
}
