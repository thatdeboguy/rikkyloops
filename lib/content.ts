import { cache } from "react";

export const defaultContent = {
  announcement: "MADE BY HAND. WORN WITH LOVE. ✧ A LITTLE JOY IN EVERY LOOP.",
  footerText: "A little yarn. A lot of heart.\nThoughtfully handmade pieces,\nfor a life beautifully your own.",
  heroEyebrow: "SLOW FASHION. FULL OF FEELING.",
  heroTitle: "A little yarn.\nA lot of you.",
  heroDescription: "For sunny days, cosy moments, and everything in between. Discover crochet pieces as unique as the person wearing them.",
  heroImage: "/images/hero.webp",
  storyTitle: "Every stitch.\nA little soul.",
  storyText: "We believe the things you wear should mean something. Rikkyloops is a celebration of thoughtful craft, playful colour, and the quiet joy of making something by hand.\n\nFrom the first loop to the final detail, our pieces are made to feel personal. A little different. A little unexpected. Completely you.",
  storyImage: "/images/sweater.webp",
  closingTitle: "You dream it. We loop it.",
  closingText: "A favourite colour? A special occasion? A just-because idea?\nLet’s talk about a piece that feels like you.",
  contactTitle: "We’re all ears.",
  contactIntro: "Questions about a piece, help with sizing, or a custom idea? We’d love to hear from you.",
  contactEmail: "", contactPhone: "", contactAddress: "",
  returnsTitle: "Return policy",
  returnsText: "The store is in preview. Final return and exchange terms will be published before orders are accepted.\n\nBefore ordering, check the product details and size guide, and contact us if you need help choosing your fit.\n\nReturn windows, eligibility, item condition requirements, and delivery costs will be confirmed before ordering opens. Terms specific to personalised pieces will be explained before an order is accepted.\n\nIf something isn’t right, keep your order reference and contact us with a description and clear photos of the issue.",
  sizeTitle: "Let’s find your fit.",
  sizeIntro: "A little measuring makes all the difference. Start here, then check the details of your chosen piece.",
  sizeNotes: "Illustrative body measurements in centimetres. Final garment measurements and fit notes will be confirmed with each product.\n\nUse a soft tape. Measure your bust and hips around their fullest points and your waist at its natural waistline. Keep the tape level without pulling it tight.\n\nBetween sizes? Contact us with your measurements and the name of your chosen piece.",
  dressImage: "/images/dress.webp", topImage: "/images/top.webp", sweaterImage: "/images/sweater.webp", bagImage: "/images/bag.webp", hatImage: "/images/hat.webp",
  faqs: [
    { question: "Can I request a custom piece?", answer: "Yes. Tell us about your preferred style, colour, measurements, and occasion. Availability and a quote will be confirmed before an order is accepted." },
    { question: "How do I choose my size?", answer: "Compare your measurements with our size guide. If you are between sizes, get in touch for advice about the fit of your chosen piece." },
    { question: "How long will my piece take?", answer: "Handmade pieces take time. Production and delivery estimates will be confirmed before an order is accepted." },
    { question: "How do I care for crochet?", answer: "Follow the care instructions provided with your finished piece. Store crochet folded to help preserve its shape." },
  ],
  sizeChart: [
    { size: "XS", bust: "80–84", waist: "62–66", hips: "86–90" },
    { size: "S", bust: "85–89", waist: "67–71", hips: "91–95" },
    { size: "M", bust: "90–94", waist: "72–76", hips: "96–100" },
    { size: "L", bust: "95–101", waist: "77–83", hips: "101–107" },
    { size: "XL", bust: "102–108", waist: "84–90", hips: "108–114" },
  ],
};
export type SiteContent = typeof defaultContent;
export const getContent = cache(async (): Promise<SiteContent> => {
  if (!process.env.API_BASE_URL) return defaultContent;
  const response = await fetch(`${process.env.API_BASE_URL.replace(/\/$/, "")}/content`, { cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error("Site content is temporarily unavailable.");
  return { ...defaultContent, ...await response.json() };
});
