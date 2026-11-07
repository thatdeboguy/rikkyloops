import { PageHeading } from "@/components/section-heading";
import Link from "next/link";
import { getContent } from "@/lib/content";
export const metadata = { title: "Size guide" };
export default async function SizeGuide() {
  const content = await getContent();
  return (
    <>
      <PageHeading
        eyebrow="A FIT THAT FEELS LIKE YOU"
        title={content.sizeTitle}
        description={content.sizeIntro}
      />
      <article className="prose rounded-2xl border border-line bg-white py-8 shadow-sm sm:px-10">
        <div className="table-wrap">
          <table>
            <caption>Body measurements (cm)</caption>
            <thead>
              <tr>
                <th scope="col">Size</th>
                <th scope="col">Bust</th>
                <th scope="col">Waist</th>
                <th scope="col">Hips</th>
              </tr>
            </thead>
            <tbody>
              {content.sizeChart.map((r, i) => (
                <tr key={i}>
                  <th scope="row">{r.size}</th>
                  <td>{r.bust}</td>
                  <td>{r.waist}</td>
                  <td>{r.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2>Finding your fit</h2>
        <p className="content-text">{content.sizeNotes}</p>
        <Link className="button" href="/contact">
          Ask us about sizing ↗
        </Link>
      </article>
    </>
  );
}
