import Link from "next/link";
export default function NotFound() {
  return (
    <section className="empty">
      <span className="eyebrow">A LOOSE THREAD</span>
      <h1>We couldn’t find that page.</h1>
      <p>Let’s get you back to something lovely.</p>
      <Link className="button" href="/shop">
        Explore the collection ↗
      </Link>
    </section>
  );
}
