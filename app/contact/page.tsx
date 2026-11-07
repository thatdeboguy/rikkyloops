import Link from "next/link";
import { ContactForm } from "@/components/store";
import { getContent } from "@/lib/content";
export const metadata = { title: "Contact & FAQs" };
export default async function Contact() {
  const content = await getContent();
  const email = content.contactEmail || process.env.CONTACT_EMAIL;
  return (
    <>
      <h1 className="sr-only">{content.contactTitle}</h1>
      <section className="contact-layout">
        <div className="contact-intro">
          <h2>
            A little hello
            <br />
            goes a long way.
          </h2>
          <p>
            Tell us what you have in mind. Share the details of the piece you
            love, your measurements, or the occasion you’re making memories for.
          </p>
          <div className="contact-detail">
            <h3>Get in touch</h3>
            {email ? (
              <a className="text-link" href={`mailto:${email}`}>
                {email}
              </a>
            ) : (
              <p>
                Our direct contact details will be published when the store
                opens.
              </p>
            )}
            {content.contactPhone && <p>{content.contactPhone}</p>}
            {content.contactAddress && (
              <p className="content-text">{content.contactAddress}</p>
            )}
          </div>
          <div className="contact-detail">
            <h3>A little help with the fit?</h3>
            <Link href="/size-guide" className="text-link">
              Explore the size guide ↗
            </Link>
          </div>
        </div>
        <ContactForm />
      </section>
      <section className="faq [&_details]:rounded-xl [&_details]:px-4 [&_details]:transition-colors [&_details:hover]:bg-rose">
        <span className="eyebrow" style={{ textAlign: "center" }}>
          GOOD QUESTIONS. THOUGHTFUL ANSWERS.
        </span>
        <h2>A few things to know.</h2>
        {content.faqs.map((faq, index) => (
          <details key={index}>
            <summary>{faq.question}</summary>
            <p className="content-text">{faq.answer}</p>
          </details>
        ))}
      </section>
    </>
  );
}
