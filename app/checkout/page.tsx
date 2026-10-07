import { Checkout } from "@/components/store";

export const metadata = { title: "Checkout preview" };

export default function CheckoutPage() {
  return (
    <>
      <div className="page-heading checkout-heading">
        <span className="eyebrow">CHECKOUT PREVIEW</span>
        <h1>Complete your details.</h1>
        <p>No payment will be collected and no order will be created.</p>
      </div>
      <Checkout />
    </>
  );
}
