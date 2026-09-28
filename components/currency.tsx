"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  formatPrice,
  isCurrency,
  productPrice,
  type Currency,
} from "@/lib/currency";
import type { Product } from "@/lib/catalog";

const CurrencyContext = createContext<{
  currency: Currency;
  select: (currency: Currency) => void;
}>({ currency: "NGN", select: () => {} });
export function CurrencyProvider({
  children,
  initialCurrency,
}: {
  children: ReactNode;
  initialCurrency: Currency;
}) {
  const [currency, setCurrency] = useState<Currency>(initialCurrency);
  const router = useRouter();
  function select(next: Currency) {
    setCurrency(next);
    document.cookie = `rikkyloops_currency=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    router.refresh();
  }
  return (
    <CurrencyContext.Provider value={{ currency, select }}>
      {children}
    </CurrencyContext.Provider>
  );
}
export function CurrencySelector() {
  const { currency, select } = useContext(CurrencyContext);
  return (
    <label className="currency-select">
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z" />
      </svg>
      <select
        aria-label="Display currency"
        value={currency}
        onChange={(event) => {
          if (isCurrency(event.target.value)) select(event.target.value);
        }}
      >
        <option value="NGN">{"\u20a6"} NGN</option>
        <option value="USD">$ USD</option>
        <option value="TRY">{"\u20ba"} TRY</option>
      </select>
    </label>
  );
}
export function Price({
  product,
  quantity = 1,
}: {
  product: Product;
  quantity?: number;
}) {
  const { currency } = useContext(CurrencyContext);
  const amount = productPrice(product, currency);
  return (
    <span className="display-price" data-currency={currency}>
      {amount === null
        ? `Price unavailable in ${currency}`
        : formatPrice(amount * quantity, currency)}
    </span>
  );
}
export function BagSubtotal({
  items,
}: {
  items: { product: Product; quantity: number }[];
}) {
  const { currency } = useContext(CurrencyContext);
  const amounts = items.map((item) => {
    const price = productPrice(item.product, currency);
    return price === null ? null : Math.round(price * 100) * item.quantity;
  });
  return (
    <span className="display-price" data-currency={currency}>
      {amounts.some((amount) => amount === null)
        ? `Some prices unavailable in ${currency}`
        : formatPrice(
            amounts.reduce<number>(
              (total, amount) => total + (amount ?? 0),
              0,
            ) / 100,
            currency,
          )}
    </span>
  );
}
