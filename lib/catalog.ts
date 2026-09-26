export const categories = ["Dresses", "Tops", "Sweaters", "Bags and accessories", "Hats"] as const;
export type Product = { id: string; name: string; category: string; price: number; image: string; color: string; sizes: string[]; description: string };
export const sampleProducts: Product[] = [
  { id: "solana-dress", name: "The Solana Dress", category: "Dresses", price: 65000, image: "/images/dress.webp", color: "Natural cream", sizes: ["XS", "S", "M", "L", "XL"], description: "Sunlit afternoons, slow weekends, and a little everyday magic. An airy crochet dress with delicate openwork and an easy silhouette." },
  { id: "terra-top", name: "The Terra Top", category: "Tops", price: 25000, image: "/images/top.webp", color: "Terracotta", sizes: ["XS", "S", "M", "L", "XL"], description: "A warm earthy tone meets beautiful stitchwork. Pair this easy summer top with your favourite denim or a flowing skirt." },
  { id: "meadow-cardigan", name: "The Meadow Cardigan", category: "Sweaters", price: 48000, image: "/images/sweater.webp", color: "Sage green", sizes: ["S", "M", "L", "XL"], description: "Your slow-morning layer. A relaxed crochet cardigan in soft sage, with texture that makes even the simplest outfit feel special." },
  { id: "everyday-tote", name: "The Everyday Tote", category: "Bags and accessories", price: 28000, image: "/images/bag.webp", color: "Natural cream", sizes: ["One size"], description: "A little texture for wherever the day takes you. A beautifully crocheted carryall finished with warm wooden handles." },
  { id: "lilac-bucket-hat", name: "The Lilac Bucket Hat", category: "Hats", price: 18000, image: "/images/hat.webp", color: "Lilac", sizes: ["S/M", "L/XL"], description: "A playful finishing touch. Soft lilac yarn and a relaxed brim bring an easy pop of colour to your everyday wardrobe." },
];
export const money = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
export async function getProducts(): Promise<Product[]> {
  if (!process.env.API_BASE_URL) return sampleProducts;
  const response = await fetch(`${process.env.API_BASE_URL.replace(/\/$/, "")}/products`, { cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error("The collection is temporarily unavailable.");
  const data = await response.json();
  if (!Array.isArray(data) || !data.every((p) => typeof p.id === "string" && typeof p.name === "string" && typeof p.category === "string" && typeof p.price === "number" && p.price >= 0 && typeof p.image === "string" && typeof p.color === "string" && typeof p.description === "string" && Array.isArray(p.sizes) && p.sizes.every((s: unknown) => typeof s === "string"))) throw new Error("Invalid catalogue response");
  return data;
}
