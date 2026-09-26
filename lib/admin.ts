import { cookies } from "next/headers";
export const adminCookie = "rikkyloops_admin";
export function apiBase() {
  if (!process.env.API_BASE_URL) throw new Error("API_BASE_URL is not configured.");
  return process.env.API_BASE_URL.replace(/\/$/, "");
}
export async function currentAdmin(): Promise<{ id: string; username: string } | null> {
  const token = (await cookies()).get(adminCookie)?.value;
  if (!token) return null;
  const response = await fetch(`${apiBase()}/auth/me`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Admin service is temporarily unavailable.");
  return response.json();
}
