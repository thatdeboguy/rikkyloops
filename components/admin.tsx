"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminFrame, type AdminSection } from "@/components/admin-frame";
import { categories, money, type Product } from "@/lib/catalog";
import { defaultContent, type SiteContent } from "@/lib/content";

async function request(path: string, method = "GET", body?: unknown) {
  const file = body instanceof File;
  const response = await fetch(`/api/admin/${path}`, { method, headers: body !== undefined ? { "Content-Type": file ? body.type : "application/json" } : {}, body: body === undefined ? undefined : file ? body : JSON.stringify(body) });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    if (response.status === 401 && path !== "auth/login") window.dispatchEvent(new Event("admin-session-expired"));
    const details = data?.details?.map((d: { field: string; message: string }) => `${d.field}: ${d.message}`).join(". ");
    throw new Error(details || data?.message || "The request failed.");
  }
  return data;
}
function errorMessage(error: unknown) { return error instanceof Error ? error.message : "Something went wrong. Please try again."; }

function PasswordForm() {
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const router = useRouter();
  return <details className="admin-panel admin-password" open><summary>Change password</summary><form className="admin-editor" onSubmit={async e => {
    e.preventDefault(); const form = new FormData(e.currentTarget); setError("");
    if (form.get("newPassword") !== form.get("confirmPassword")) { setError("The new passwords do not match."); return; }
    setBusy(true); try { await request("auth/password", "POST", { currentPassword: form.get("currentPassword"), newPassword: form.get("newPassword") }); router.replace("/admin/login"); router.refresh(); } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); }
  }}><label>Current password<input type="password" name="currentPassword" autoComplete="current-password" required maxLength={128}/></label><label>New password<input type="password" name="newPassword" autoComplete="new-password" required minLength={12} maxLength={128}/></label><label>Confirm new password<input type="password" name="confirmPassword" autoComplete="new-password" required minLength={12} maxLength={128}/></label><p>Use at least 12 characters. Changing your password signs out all sessions.</p><p role="alert" className="admin-error">{error}</p><button className="button" disabled={busy}>{busy ? "Updating…" : "Update password"}</button></form></details>;
}

export function AdminLogin() {
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false); const router = useRouter();
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    try { await request("auth/login", "POST", { username: form.get("username"), password: form.get("password") }); router.replace("/admin"); router.refresh(); }
    catch (error) { setError(errorMessage(error)); } finally { setBusy(false); }
  }
  return <div className="admin-login"><Link href="/" className="brand">rikkyloops</Link><span className="eyebrow">THE STUDIO</span><h1>Welcome back.</h1><p>Your collection, your story, your space.</p><form onSubmit={login}><label>Username<input name="username" autoComplete="username" required maxLength={80}/></label><label>Password<input type="password" name="password" autoComplete="current-password" required maxLength={128}/></label><button className="button wide" disabled={busy}>{busy ? "Signing in…" : "Sign in →"}</button><p className="admin-error" role="alert">{error}</p></form><Link href="/" className="text-link">Back to the storefront</Link></div>;
}

function ImageUpload({ value, onChange, label = "Image" }: { value: string; onChange: (url: string) => void; label?: string }) {
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  return <div className="admin-upload"><label>{label}<input value={value} onChange={e => onChange(e.target.value)} placeholder="Upload an image or paste an HTTPS URL"/></label><label className="admin-file">{busy ? "Uploading…" : "Choose image"}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={async e => {
    const file = e.target.files?.[0]; if (!file) return; setError("");
    if (file.size > 3 * 1024 * 1024) { setError("Please choose an image smaller than 3 MB."); e.target.value = ""; return; }
    setBusy(true); try { const uploaded = await request("uploads", "POST", file); onChange(uploaded.url); } catch (error) { setError(errorMessage(error)); } finally { setBusy(false); e.target.value = ""; }
  }}/></label><small>JPG, PNG, or WebP · Up to 3 MB. Uploaded images are saved to your media storage.</small>{value && <a href={value} target="_blank" rel="noreferrer" className="text-link">Preview image ↗</a>}<p className="admin-error" role="alert">{error}</p></div>;
}

const emptyProduct = { name: "", sizes: ["S", "M", "L"], price: 0, priceUsd: null, priceTry: null, category: "Dresses", image: "", color: "", description: "" };
type ProductDraft = Omit<Product, "id">;
function ProductEditor({ product, onSaved, onClose }: { product: Product | null; onSaved: () => void; onClose: () => void }) {
  const [draft, setDraft] = useState<ProductDraft>(product || emptyProduct);
  const [sizes, setSizes] = useState((product?.sizes || emptyProduct.sizes).join(", "));
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  function change<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) { setDraft(d => ({ ...d, [key]: value })); }
  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try { const data = { name: draft.name, price: Number(draft.price), priceUsd: draft.priceUsd ?? null, priceTry: draft.priceTry ?? null, sizes: sizes.split(",").map(s => s.trim()).filter(Boolean), category: draft.category, image: draft.image, color: draft.color, description: draft.description }; await request(product ? `products/${product.id}` : "products", product ? "PATCH" : "POST", data); onSaved(); }
    catch (error) { setError(errorMessage(error)); } finally { setBusy(false); }
  }
  return <section className="admin-panel"><div className="split"><h2>{product ? "Edit your piece" : "A new piece"}</h2><button className="admin-secondary" onClick={onClose} disabled={busy}>Cancel</button></div><form onSubmit={save} className="admin-editor"><div className="admin-fields"><label>Product name<input required maxLength={150} value={draft.name} onChange={e => change("name", e.target.value)}/></label><label>Price (NGN)<input type="number" required min="0" max="99999999.99" step="0.01" value={draft.price} onChange={e => change("price", Number(e.target.value))}/></label>{(["priceUsd", "priceTry"] as const).map(field => <label key={field}>Price ({field === "priceUsd" ? "USD" : "TRY"})<input aria-label={field === "priceUsd" ? "Price (USD)" : "Price (TRY)"} type="number" min="0" max="99999999.99" step="0.01" value={draft[field] ?? ""} onChange={e => change(field, e.target.value === "" ? null : Number(e.target.value))}/><small>Leave blank if unavailable in this currency.</small></label>)}<label>Category<select value={draft.category} onChange={e => change("category", e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></label><label>Sizes, separated by commas<input required value={sizes} onChange={e => setSizes(e.target.value)} placeholder="S, M, L or One size"/></label><label>Colour<input maxLength={80} value={draft.color} onChange={e => change("color", e.target.value)}/></label></div><label>Description<textarea rows={4} maxLength={5000} value={draft.description} onChange={e => change("description", e.target.value)}/></label><ImageUpload value={draft.image} onChange={value => change("image", value)}/><p className="admin-error" role="alert">{error}</p><button className="button" disabled={busy}>{busy ? "Saving…" : "Save product →"}</button></form></section>;
}

type TextKey = Exclude<keyof SiteContent, "faqs" | "sizeChart">;
const sections: { title: string; fields: [TextKey, string, "text" | "area" | "image"][] }[] = [
  { title: "Header & footer", fields: [["announcement", "Announcement bar", "text"], ["footerText", "Footer description", "area"]] },
  { title: "Homepage", fields: [["heroEyebrow", "Hero caption", "text"], ["heroTitle", "Hero heading", "area"], ["heroDescription", "Hero description", "area"], ["heroImage", "Hero image", "image"], ["storyTitle", "Our story heading", "area"], ["storyText", "Our story", "area"], ["storyImage", "Our story image", "image"], ["closingTitle", "Closing heading", "text"], ["closingText", "Closing description", "area"]] },
  { title: "Category images", fields: [["dressImage", "Dresses", "image"], ["topImage", "Tops", "image"], ["sweaterImage", "Sweaters", "image"], ["bagImage", "Bags & accessories", "image"], ["hatImage", "Hats", "image"]] },
  { title: "Contact", fields: [["contactTitle", "Page heading", "text"], ["contactIntro", "Introduction", "area"], ["contactEmail", "Public email", "text"], ["contactPhone", "Phone number", "text"], ["contactAddress", "Business address", "area"]] },
  { title: "Return policy", fields: [["returnsTitle", "Page heading", "text"], ["returnsText", "Policy text", "area"]] },
  { title: "Size guide", fields: [["sizeTitle", "Page heading", "text"], ["sizeIntro", "Introduction", "area"], ["sizeNotes", "Measuring instructions & notes", "area"]] },
];
function ContentEditor() {
  const [content, setContent] = useState<SiteContent | null>(null); const [error, setError] = useState(""); const [status, setStatus] = useState(""); const [busy, setBusy] = useState(false); const router = useRouter();
  const load = useCallback(() => { request("content").then(data => setContent({ ...defaultContent, ...data })).catch(e => setError(errorMessage(e))); }, []);
  useEffect(() => { load(); }, [load]);
  if (!content) return <section className="admin-panel"><p role="status">{error || "Loading your site content…"}</p>{error && <button className="button" onClick={load}>Retry</button>}</section>;
  function setField(key: TextKey, value: string) { setContent(c => c && ({ ...c, [key]: value })); setStatus(""); }
  return <form className="admin-content" onSubmit={async e => { e.preventDefault(); setBusy(true); setError(""); setStatus(""); try { await request("content", "PATCH", content); setStatus("Your website content has been saved."); router.refresh(); } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); } }}>
    <div className="admin-save"><div><strong>Make it your own</strong><p>Changes appear on the storefront after saving.</p></div><button className="button" disabled={busy}>{busy ? "Saving…" : "Save website changes →"}</button></div>
    <p className="admin-error" role="alert">{error}</p><p role="status" className="admin-success">{status}</p>
    {sections.map((section, i) => <details key={section.title} className="admin-panel" open={i === 0}><summary>{section.title}</summary><div className="admin-content-fields">{section.fields.map(([key, label, type]) => type === "image" ? <ImageUpload key={key} value={content[key]} label={label} onChange={value => setField(key, value)}/> : <label key={key}>{label}{type === "area" ? <textarea rows={key === "returnsText" ? 10 : 4} value={content[key]} maxLength={10000} onChange={e => setField(key, e.target.value)}/> : <input value={content[key]} maxLength={254} type={key === "contactEmail" ? "email" : "text"} onChange={e => setField(key, e.target.value)}/>}</label>)}</div></details>)}
    <details className="admin-panel"><summary>Frequently asked questions</summary><div className="admin-content-fields">{content.faqs.map((faq, index) => <div className="admin-repeat" key={index}><label>Question<input required maxLength={250} value={faq.question} onChange={e => setContent({ ...content, faqs: content.faqs.map((f, i) => i === index ? { ...f, question: e.target.value } : f) })}/></label><label>Answer<textarea required maxLength={2000} value={faq.answer} onChange={e => setContent({ ...content, faqs: content.faqs.map((f, i) => i === index ? { ...f, answer: e.target.value } : f) })}/></label><button type="button" className="admin-secondary" onClick={() => setContent({ ...content, faqs: content.faqs.filter((_, i) => i !== index) })}>Remove question</button></div>)}<button type="button" className="admin-secondary" disabled={content.faqs.length >= 30} onClick={() => setContent({ ...content, faqs: [...content.faqs, { question: "", answer: "" }] })}>+ Add question</button></div></details>
    <details className="admin-panel"><summary>Size chart (centimetres)</summary><div className="admin-content-fields">{content.sizeChart.map((row, index) => <div className="admin-size-row" key={index}>{(["size", "bust", "waist", "hips"] as const).map(key => <label key={key}>{key}<input required={key === "size"} maxLength={key === "size" ? 30 : 250} value={row[key]} onChange={e => setContent({ ...content, sizeChart: content.sizeChart.map((r, i) => i === index ? { ...r, [key]: e.target.value } : r) })}/></label>)}<button type="button" className="admin-secondary" onClick={() => setContent({ ...content, sizeChart: content.sizeChart.filter((_, i) => i !== index) })}>Remove</button></div>)}<button type="button" className="admin-secondary" disabled={content.sizeChart.length >= 30} onClick={() => setContent({ ...content, sizeChart: [...content.sizeChart, { size: "", bust: "", waist: "", hips: "" }] })}>+ Add size</button></div></details>
  </form>;
}

export function AdminDashboard({ username }: { username: string }) {
  const [tab, setTab] = useState<AdminSection>("products"); const [products, setProducts] = useState<Product[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [notice, setNotice] = useState(""); const [editing, setEditing] = useState<Product | null | undefined>(); const [search, setSearch] = useState(""); const [offset, setOffset] = useState(0); const [deleting, setDeleting] = useState<Product | null>(null); const [busy, setBusy] = useState(false); const router = useRouter();
  const load = useCallback(() => request(`products?limit=20&offset=${offset}&q=${encodeURIComponent(search)}`).then(data => { setProducts(data); setError(""); }).catch(e => setError(errorMessage(e))).finally(() => setLoading(false)), [offset, search]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { const expired = () => { router.replace("/admin/login"); router.refresh(); }; window.addEventListener("admin-session-expired", expired); return () => window.removeEventListener("admin-session-expired", expired); }, [router]);
  return <AdminFrame username={username} section={tab} busy={busy} onNavigate={next => { if (next === tab) return true; if (editing !== undefined && !window.confirm("Discard unsaved product changes?")) return false; setEditing(undefined); setNotice(""); setTab(next); return true; }} onLogout={async () => { setBusy(true); try { await request("auth/logout", "POST", {}); router.replace("/admin/login"); router.refresh(); } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); } }}><p className="admin-error" role="alert">{error}</p><p className="admin-success" role="status">{notice}</p>
    {tab === "settings" ? <PasswordForm/> : tab === "content" ? null : editing !== undefined ? <ProductEditor key={editing?.id || "new"} product={editing} onClose={() => { if (window.confirm("Discard unsaved changes?")) setEditing(undefined); }} onSaved={() => { setEditing(undefined); setNotice("Product saved."); load(); router.refresh(); }}/> : <section className="admin-panel"><div className="admin-toolbar"><h2>Your collection</h2><button className="button" onClick={() => { setEditing(null); setNotice(""); }}>+ Add product</button></div><form className="admin-search" onSubmit={e => { e.preventDefault(); setOffset(0); setSearch(String(new FormData(e.currentTarget).get("q") || "")); }}><input name="q" aria-label="Search products" placeholder="Find a product…"/><button className="admin-secondary">Search</button></form>
      {loading ? <p role="status">Loading products…</p> : <><div className="table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Category</th><th>Sizes</th><th>Price</th><th>Actions</th></tr></thead><tbody>{products.map(p => <tr key={p.id}><td><strong>{p.name}</strong><small>{p.color}{!p.image ? " · No image" : ""}</small></td><td>{p.category}</td><td>{p.sizes.join(", ")}</td><td>{money(p.price)}<small>USD: {p.priceUsd == null ? "Not set" : p.priceUsd.toFixed(2)}</small><small>TRY: {p.priceTry == null ? "Not set" : p.priceTry.toFixed(2)}</small></td><td><div className="admin-row-actions"><button className="admin-secondary" onClick={() => { setEditing(p); setNotice(""); }}>Edit</button><button className="admin-danger" onClick={() => setDeleting(p)}>Delete</button></div></td></tr>)}</tbody></table></div>{products.length === 0 && <div className="empty"><h2>{search ? "No matching pieces." : "Your collection starts here."}</h2><p>{search ? "Try a different search." : "Add your first product to bring your shop to life."}</p></div>}<div className="admin-pagination"><button className="admin-secondary" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - 20))}>← Previous</button><span>Page {offset / 20 + 1}</span><button className="admin-secondary" disabled={products.length < 20} onClick={() => setOffset(offset + 20)}>Next →</button></div></>}
    </section>}
    {deleting && <div className="admin-confirm" role="alertdialog" aria-modal="true" aria-labelledby="delete-title"><div><h2 id="delete-title">Delete this piece?</h2><p>“{deleting.name}” will be removed from the shop. This cannot be undone. Its uploaded image will remain in storage.</p><div className="admin-row-actions"><button className="admin-secondary" autoFocus disabled={busy} onClick={() => setDeleting(null)}>Keep product</button><button className="button" disabled={busy} onClick={async () => { setBusy(true); try { await request(`products/${deleting.id}`, "DELETE"); setDeleting(null); setNotice("Product deleted."); await load(); router.refresh(); } catch (e) { setError(errorMessage(e)); setDeleting(null); } finally { setBusy(false); } }}>{busy ? "Deleting…" : "Delete product"}</button></div></div></div>}
    <div hidden={tab !== "content"}><ContentEditor/></div>
  </AdminFrame>;
}
