import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminCookie, apiBase } from "@/lib/admin";

type Context = { params: Promise<{ path: string[] }> };
async function handle(request: Request, { params }: Context) {
  const path = (await params).path.join("/");
  const method = request.method;
  const allowed = (path === "auth/login" && method === "POST") || (["auth/logout", "auth/password"].includes(path) && method === "POST") || (path === "auth/me" && method === "GET") || (path === "products" && ["GET", "POST"].includes(method)) || (/^products\/[a-f0-9-]{36}$/i.test(path) && ["PATCH", "DELETE"].includes(method)) || (path === "content" && ["GET", "PATCH"].includes(method)) || (path === "uploads" && method === "POST");
  if (!allowed) return NextResponse.json({ message: "Endpoint not found." }, { status: 404 });
  if (method !== "GET" && request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ message: "Request origin is not allowed." }, { status: 403 });
  const jar = await cookies();
  const token = jar.get(adminCookie)?.value;
  if (path !== "auth/login" && !token) return NextResponse.json({ message: "Please sign in." }, { status: 401 });
  try {
    const limit = path === "uploads" ? 3 * 1024 * 1024 : 32768;
    if (Number(request.headers.get("content-length")) > limit) return NextResponse.json({ message: "File or request is too large." }, { status: 413 });
    let body: Uint8Array | undefined;
    if (method !== "GET" && request.body) {
      const reader = request.body.getReader(); const chunks: Uint8Array[] = []; let length = 0;
      while (true) { const { done, value } = await reader.read(); if (done) break; length += value.length; if (length > limit) { await reader.cancel(); return NextResponse.json({ message: "File or request is too large." }, { status: 413 }); } chunks.push(value); }
      body = new Uint8Array(length); let offset = 0; for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.length; }
    }
    const query = method === "GET" && path === "products" ? new URL(request.url).search : "";
    const response = await fetch(`${apiBase()}/${path}${query}`, { method, headers: {
      "Content-Type": request.headers.get("content-type") || "application/json",
      ...(token && path !== "auth/login" ? { Authorization: `Bearer ${token}` } : {}),
    }, body: body ? Buffer.from(body) : undefined, cache: "no-store", signal: AbortSignal.timeout(path === "uploads" ? 30000 : 10000) });
    if (response.status === 401) jar.delete(adminCookie);
    if (path === "auth/logout" && (response.ok || response.status === 401)) { jar.delete(adminCookie); return new NextResponse(null, { status: 204 }); }
    if (path === "auth/password" && response.ok) jar.delete(adminCookie);
    if (response.status === 204) return new NextResponse(null, { status: 204 });
    const data = await response.json();
    if (path === "auth/login" && response.ok) {
      jar.set(adminCookie, data.token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: data.expiresIn });
      return NextResponse.json({ admin: data.admin }, { headers: { "Cache-Control": "no-store" } });
    }
    return NextResponse.json(data, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ message: "The admin service could not be reached. Please try again." }, { status: 502 }); }
}
export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const DELETE = handle;
