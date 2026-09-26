import { CategoryGrid } from "@/components/catalog";
export const metadata = { title: "Categories" };
export default function Categories() { return <><div className="page-heading"><span className="eyebrow">FIND YOUR KIND OF LOVELY</span><h1>Made for every mood.</h1><p>From sun-ready dresses to the finishing touches. Explore your favourite kind of crochet.</p></div><section className="section"><CategoryGrid/></section></>; }
