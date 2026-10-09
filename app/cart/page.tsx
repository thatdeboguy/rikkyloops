import { Cart } from "@/components/store";

export const metadata = { title: "Your cart" };

export default function CartPage() {
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">YOUR LITTLE COLLECTION OF JOY</span>
        <h1>Your shopping cart</h1>
      </div>
      <Cart />
    </>
  );
}
