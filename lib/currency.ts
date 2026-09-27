import type { Product } from "./catalog";
export const currencies = ["NGN", "USD", "TRY"] as const;
export type Currency = typeof currencies[number];
export function isCurrency(value: unknown): value is Currency {
  return typeof value === "string" && currencies.includes(value as Currency);
}
export function productPrice(product: Pick<Product, "price" | "priceUsd" | "priceTry">, currency: Currency): number | null {
  const value = currency === "NGN" ? product.price : currency === "USD" ? product.priceUsd : product.priceTry;
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}
export function formatPrice(amount: number, currency: Currency) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency", currency, currencyDisplay: "narrowSymbol",
    minimumFractionDigits: currency === "NGN" ? 0 : 2, maximumFractionDigits: 2,
  }).format(amount);
}
