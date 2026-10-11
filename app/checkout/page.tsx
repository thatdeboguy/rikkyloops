import { Checkout } from "@/components/store";
import { BrandLogo } from "@/components/brand-logo";
import Link from "next/link";

export const metadata = { title: "Checkout preview" };

export default function CheckoutPage() {
  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <Link href="/" aria-label="Rikkyloops home"><BrandLogo priority /></Link>
        <Link href="/cart" className="checkout-header-cart" aria-label="Return to cart">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></svg>
        </Link>
      </header>
      <Checkout />
    </div>
  );
}
