"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="empty">
      <h2>A little snag.</h2>
      <p>We couldn’t load the collection. Please try again in a moment.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
