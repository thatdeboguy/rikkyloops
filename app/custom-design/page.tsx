import { CustomDesignForm } from "@/components/custom-design-form";

export const metadata = { title: "Request a custom design" };

export default function CustomDesignPage() {
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">MADE FROM YOUR IMAGINATION</span>
        <h1>Request a custom dress.</h1>
        <p>Send us your inspiration and delivery details. We’ll review the design and contact you to discuss measurements, yarn, timing, and price.</p>
      </div>
      <section className="custom-design-layout">
        <aside className="custom-design-intro">
          <span className="eyebrow">HOW IT WORKS</span>
          <h2>Your idea, made by hand.</h2>
          <ol>
            <li>Upload a clear picture of the dress you have in mind.</li>
            <li>Tell us how to reach you and where the piece will be delivered.</li>
            <li>We’ll contact you for measurements and the final details.</li>
          </ol>
          <p className="notice">Sending a request does not place an order or take payment. We’ll confirm availability and pricing with you first.</p>
        </aside>
        <CustomDesignForm />
      </section>
    </>
  );
}
