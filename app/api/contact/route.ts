import { NextResponse } from "next/server";
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ message: "Please submit the form from this website." }, { status: 403 });
  let body;
  try { const raw = await request.text(); if (raw.length > 15000) return NextResponse.json({ message: "Your message is too long." }, { status: 413 }); body = JSON.parse(raw); } catch { return NextResponse.json({ message: "Please check your message and try again." }, { status: 400 }); }
  if (!body || typeof body.name !== "string" || !body.name.trim() || body.name.length > 100 || typeof body.email !== "string" || body.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) || typeof body.message !== "string" || body.message.trim().length < 10 || body.message.length > 5000) return NextResponse.json({ message: "Please enter your name, a valid email, and a message of 10–5,000 characters." }, { status: 400 });
  if (!process.env.API_BASE_URL) return NextResponse.json({ message: "Messaging is not open yet. Your message has not been sent. Please check back when the store opens." }, { status: 503 });
  try { const res = await fetch(`${process.env.API_BASE_URL.replace(/\/$/, "")}/contact`, { method: "POST", headers: { "Content-Type": "application/json", ...(process.env.API_SERVICE_TOKEN ? { Authorization: `Bearer ${process.env.API_SERVICE_TOKEN}` } : {}) }, body: JSON.stringify({ name: body.name.trim(), email: body.email.trim(), message: body.message.trim() }), signal: AbortSignal.timeout(10000) }); if (!res.ok) throw new Error("Contact unavailable"); return NextResponse.json({ message: "Thank you! Your message has been sent." }); } catch { return NextResponse.json({ message: "We couldn’t confirm delivery of your message. Please try again shortly." }, { status: 502 }); }
}
