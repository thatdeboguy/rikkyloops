import { BrandLogo, BrandProvider } from "@/components/brand-logo";
import { cookies } from "next/headers";
import { CurrencyProvider } from "@/components/currency";
import { isCurrency } from "@/lib/currency";
import type { Metadata } from "next";
import Link from "next/link";
import { StoreProvider } from "@/components/store";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { getContent, defaultContent } from "@/lib/content";
const siteMetadata: Metadata = { title: { default: "Rikkyloops — A little joy in every loop", template: "%s | Rikkyloops" }, description: "Thoughtfully handmade crochet dresses, tops, sweaters, bags and hats. Discover pieces with personality at Rikkyloops." };
export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent().catch(() => defaultContent);
  const logo = content.logoImage || "/images/rikkyloops-logo.jpeg";
  return { ...siteMetadata, icons: { icon: logo, apple: logo } };
}
export default async function RootLayout({ children }: { children: React.ReactNode }) { const [content, cookieStore] = await Promise.all([getContent().catch(() => defaultContent), cookies()]); const savedCurrency = cookieStore.get("rikkyloops_currency")?.value; const initialCurrency = isCurrency(savedCurrency) ? savedCurrency : "NGN"; return <html lang="en"><body><BrandProvider logo={content.logoImage}><CurrencyProvider initialCurrency={initialCurrency}><StoreProvider><SiteShell announcement={content.announcement} footer={<footer><div className="footer-top"><div className="footer-brand"><Link href="/" className="brand" aria-label="Rikkyloops home"><BrandLogo/></Link><p className="content-text">{content.footerText}</p></div><div><h3>Explore</h3><Link href="/shop">Shop all pieces</Link><Link href="/bag">Shopping bag</Link><Link href="/categories">Our categories</Link><Link href="/#our-story">Our story</Link></div><div><h3>Here to help</h3><Link href="/contact">Contact & FAQs</Link><Link href="/size-guide">Size guide</Link><Link href="/returns">Return policy</Link></div><div className="footer-note"><h3>Made with intention.</h3><p>Every loop is a small act of love.<br/>Thank you for choosing handmade.</p><Link className="text-link" href="/contact">Say hello ↗</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Rikkyloops. All rights reserved.</span><span>{process.env.API_BASE_URL ? "Thoughtfully made, just for you" : "Preview collection: sample prices and imagery"}</span><span>Handmade. Always. ♡</span></div></footer>}>{children}</SiteShell></StoreProvider></CurrencyProvider></BrandProvider></body></html>; }
