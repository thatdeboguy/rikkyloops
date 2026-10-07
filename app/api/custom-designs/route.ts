import { NextResponse } from "next/server";
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ message: "Please submit the form from this website." }, { status: 403 });
  if (!process.env.API_BASE_URL) return NextResponse.json({ message: "Custom design requests are not open yet." }, { status: 503 });
  let data: FormData;
  try { data = await request.formData(); }
  catch { return NextResponse.json({ message: "We couldn’t read this form. Please try again." }, { status: 400 }); }
  const text = (name: string) => { const value = data.get(name); return typeof value === "string" ? value.trim() : ""; };
  const image = data.get("image");
  if (!(image instanceof File) || !IMAGE_TYPES.has(image.type) || !image.size || image.size > MAX_IMAGE_BYTES) return NextResponse.json({ message: "Choose a JPG, PNG, or WebP image no larger than 3 MB." }, { status: 400 });
  const payload = { name: text("name"), email: text("email"), phone: text("phone"), deliveryAddress: text("deliveryAddress"), measurements: text("measurements"), notes: text("notes"), image: { contentType: image.type, data: Buffer.from(await image.arrayBuffer()).toString("base64") } };
  try {
    const response = await fetch(`${process.env.API_BASE_URL.replace(/\/$/, "")}/custom-designs`, { method: "POST", headers: { "Content-Type": "application/json", ...(process.env.API_SERVICE_TOKEN ? { Authorization: `Bearer ${process.env.API_SERVICE_TOKEN}` } : {}) }, body: JSON.stringify(payload), signal: AbortSignal.timeout(30000) });
    const result = await response.json().catch(() => ({}));
    return NextResponse.json({ message: result.message || (response.ok ? "Your design has been received." : "We couldn’t submit your request.") }, { status: response.status });
  } catch { return NextResponse.json({ message: "We couldn’t confirm your submission. Please try again shortly." }, { status: 502 }); }
}
