"use client";
import { BrandLogo } from "@/components/brand-logo";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AdminFrame, type AdminSection } from "@/components/admin-frame";
import { categories, money, type Product } from "@/lib/catalog";
import { defaultContent, type SiteContent } from "@/lib/content";

function PasswordVisibilityIcon({ visible }: { visible: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {visible ? (
        <>
          <path d="M3 3l18 18" />
          <path d="M10.6 10.7a2 2 0 0 0 2.8 2.8" />
          <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 9 5.5 9 8a7.7 7.7 0 0 1-2 3.5M6.6 6.6C4.4 8.1 3 10.5 3 12c0 2.5 4 8 9 8a9.8 9.8 0 0 0 4-.9" />
        </>
      ) : (
        <>
          <path d="M3 12c0-2.5 4-8 9-8s9 5.5 9 8-4 8-9 8-9-5.5-9-8Z" />
          <circle cx="12" cy="12" r="2.5" />
        </>
      )}
    </svg>
  );
}

async function request(path: string, method = "GET", body?: unknown) {
  const file = body instanceof File;
  const response = await fetch(`/api/admin/${path}`, {
    method,
    headers:
      body !== undefined
        ? { "Content-Type": file ? body.type : "application/json" }
        : {},
    body: body === undefined ? undefined : file ? body : JSON.stringify(body),
  });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    if (response.status === 401 && path !== "auth/login")
      window.dispatchEvent(new Event("admin-session-expired"));
    const details = data?.details
      ?.map(
        (d: { field: string; message: string }) => `${d.field}: ${d.message}`,
      )
      .join(". ");
    throw new Error(details || data?.message || "The request failed.");
  }
  return data;
}
function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

function PasswordForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  return (
    <details className="admin-panel admin-password" open>
      <summary>Change password</summary>
      <form
        className="admin-editor"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          setError("");
          if (form.get("newPassword") !== form.get("confirmPassword")) {
            setError("The new passwords do not match.");
            return;
          }
          setBusy(true);
          try {
            await request("auth/password", "POST", {
              currentPassword: form.get("currentPassword"),
              newPassword: form.get("newPassword"),
            });
            router.replace("/admin/login");
            router.refresh();
          } catch (e) {
            setError(errorMessage(e));
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          Current password
          <input
            type="password"
            name="currentPassword"
            autoComplete="current-password"
            required
            maxLength={128}
          />
        </label>
        <label>
          New password
          <input
            type="password"
            name="newPassword"
            autoComplete="new-password"
            required
            minLength={12}
            maxLength={128}
          />
        </label>
        <label>
          Confirm new password
          <input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            required
            minLength={12}
            maxLength={128}
          />
        </label>
        <p>
          Use at least 12 characters. Changing your password signs out all
          sessions.
        </p>
        <p role="alert" className="admin-error">
          {error}
        </p>
        <button className="button" disabled={busy}>
          {busy ? "Updating…" : "Update password"}
        </button>
      </form>
    </details>
  );
}

export function AdminLogin() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await request("auth/login", "POST", {
        username: form.get("username"),
        password: form.get("password"),
      });
      router.replace("/admin");
      router.refresh();
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="admin-login">
      <Link href="/" className="brand" aria-label="Rikkyloops home">
        <BrandLogo priority />
      </Link>
      <span className="eyebrow">THE STUDIO</span>
      <h1>Welcome back.</h1>
      <p>Your collection, your story, your space.</p>
      <form onSubmit={login}>
        <label>
          Username
          <input
            name="username"
            autoComplete="username"
            required
            maxLength={80}
          />
        </label>
        <div className="admin-password-field">
          <label htmlFor="admin-password">Password</label>
          <span className="admin-password-input">
            <input
              id="admin-password"
              type={passwordVisible ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              required
              maxLength={128}
            />
            <button
              type="button"
              className="admin-password-toggle"
              aria-label={passwordVisible ? "Hide password" : "Show password"}
              aria-pressed={passwordVisible}
              onClick={() => setPasswordVisible((visible) => !visible)}
            >
              <PasswordVisibilityIcon visible={passwordVisible} />
            </button>
          </span>
        </div>
        <button className="button wide" disabled={busy}>
          {busy ? "Signing in…" : "Sign in →"}
        </button>
        <p className="admin-error" role="alert">
          {error}
        </p>
      </form>
      <Link href="/" className="text-link">
        Back to the storefront
      </Link>
    </div>
  );
}

function ImageUpload({
  value,
  onChange,
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="admin-upload">
      <label>
        {label}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Upload an image or paste an HTTPS URL"
        />
      </label>
      <label className="admin-file">
        {busy ? "Uploading…" : "Choose image"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={busy}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setError("");
            if (file.size > 3 * 1024 * 1024) {
              setError("Please choose an image smaller than 3 MB.");
              e.target.value = "";
              return;
            }
            setBusy(true);
            try {
              const uploaded = await request("uploads", "POST", file);
              onChange(uploaded.url);
            } catch (error) {
              setError(errorMessage(error));
            } finally {
              setBusy(false);
              e.target.value = "";
            }
          }}
        />
      </label>
      {label === "Website logo" && (
        <div className="admin-logo-preview">
          <BrandLogo src={value} />
          <p>
            Used in the website header, footer, admin panel and login page. Save
            website changes to publish.
          </p>
          <button
            type="button"
            className="admin-secondary"
            disabled={busy || !value}
            onClick={() => onChange("")}
          >
            Use original logo
          </button>
        </div>
      )}
      <small>
        JPG, PNG, or WebP · Up to 3 MB. Save your changes to use the upload.
        Unsaved uploads expire after 24 hours.
      </small>
      {value && (
        <a href={value} target="_blank" rel="noreferrer" className="text-link">
          Preview image ↗
        </a>
      )}
      <p className="admin-error" role="alert">
        {error}
      </p>
    </div>
  );
}

const emptyProduct = {
  name: "",
  sizes: ["S", "M", "L"],
  price: 0,
  priceUsd: null,
  priceTry: null,
  category: "Dresses",
  image: "",
  color: "",
  description: "",
};
type ProductDraft = Omit<Product, "id">;
function ProductEditor({
  product,
  onSaved,
  onClose,
}: {
  product: Product | null;
  onSaved: () => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<ProductDraft>(product || emptyProduct);
  const [sizes, setSizes] = useState(
    (product?.sizes || emptyProduct.sizes).join(", "),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  function change<K extends keyof ProductDraft>(
    key: K,
    value: ProductDraft[K],
  ) {
    setDraft((d) => ({ ...d, [key]: value }));
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = {
        name: draft.name,
        price: Number(draft.price),
        priceUsd: draft.priceUsd ?? null,
        priceTry: draft.priceTry ?? null,
        sizes: sizes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        category: draft.category,
        image: draft.image,
        color: draft.color,
        description: draft.description,
      };
      await request(
        product ? `products/${product.id}` : "products",
        product ? "PATCH" : "POST",
        data,
      );
      onSaved();
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="admin-panel">
      <div className="split">
        <h2>{product ? "Edit your piece" : "A new piece"}</h2>
        <button className="admin-secondary" onClick={onClose} disabled={busy}>
          Cancel
        </button>
      </div>
      <form onSubmit={save} className="admin-editor">
        <div className="admin-fields">
          <label>
            Product name
            <input
              required
              maxLength={150}
              value={draft.name}
              onChange={(e) => change("name", e.target.value)}
            />
          </label>
          <label>
            Price (NGN)
            <input
              type="number"
              required
              min="0"
              max="99999999.99"
              step="0.01"
              value={draft.price}
              onChange={(e) => change("price", Number(e.target.value))}
            />
          </label>
          {(["priceUsd", "priceTry"] as const).map((field) => (
            <label key={field}>
              Price ({field === "priceUsd" ? "USD" : "TRY"})
              <input
                aria-label={
                  field === "priceUsd" ? "Price (USD)" : "Price (TRY)"
                }
                type="number"
                min="0"
                max="99999999.99"
                step="0.01"
                value={draft[field] ?? ""}
                onChange={(e) =>
                  change(
                    field,
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
              />
              <small>Leave blank if unavailable in this currency.</small>
            </label>
          ))}
          <label>
            Category
            <select
              value={draft.category}
              onChange={(e) => change("category", e.target.value)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Sizes, separated by commas
            <input
              required
              value={sizes}
              onChange={(e) => setSizes(e.target.value)}
              placeholder="S, M, L or One size"
            />
          </label>
          <label>
            Colour
            <input
              maxLength={80}
              value={draft.color}
              onChange={(e) => change("color", e.target.value)}
            />
          </label>
        </div>
        <label>
          Description
          <textarea
            rows={4}
            maxLength={5000}
            value={draft.description}
            onChange={(e) => change("description", e.target.value)}
          />
        </label>
        <ImageUpload
          value={draft.image}
          onChange={(value) => change("image", value)}
        />
        <p className="admin-error" role="alert">
          {error}
        </p>
        <button className="button" disabled={busy}>
          {busy ? "Saving…" : "Save product →"}
        </button>
      </form>
    </section>
  );
}

type TextKey = Exclude<keyof SiteContent, "faqs" | "sizeChart">;
const sections: {
  title: string;
  fields: [TextKey, string, "text" | "area" | "image"][];
}[] = [
  { title: "Branding", fields: [["logoImage", "Website logo", "image"]] },
  {
    title: "Header & footer",
    fields: [
      ["announcement", "Announcement bar", "text"],
      ["footerText", "Footer description", "area"],
    ],
  },
  {
    title: "Homepage",
    fields: [
      ["heroEyebrow", "Hero caption", "text"],
      ["heroTitle", "Hero heading", "area"],
      ["heroDescription", "Hero description", "area"],
      ["heroImage", "Hero image", "image"],
      ["storyTitle", "Our story heading", "area"],
      ["storyText", "Our story", "area"],
      ["storyImage", "Our story image", "image"],
      ["closingTitle", "Closing heading", "text"],
      ["closingText", "Closing description", "area"],
    ],
  },
  {
    title: "Category images",
    fields: [
      ["dressImage", "Dresses", "image"],
      ["topImage", "Tops", "image"],
      ["sweaterImage", "Sweaters", "image"],
      ["bagImage", "Bags & accessories", "image"],
      ["hatImage", "Hats", "image"],
    ],
  },
  {
    title: "Contact",
    fields: [
      ["contactTitle", "Page heading", "text"],
      ["contactIntro", "Introduction", "area"],
      ["contactEmail", "Public email", "text"],
      ["contactPhone", "Phone number", "text"],
      ["contactAddress", "Business address", "area"],
    ],
  },
  {
    title: "Return policy",
    fields: [
      ["returnsTitle", "Page heading", "text"],
      ["returnsText", "Policy text", "area"],
    ],
  },
  {
    title: "Size guide",
    fields: [
      ["sizeTitle", "Page heading", "text"],
      ["sizeIntro", "Introduction", "area"],
      ["sizeNotes", "Measuring instructions & notes", "area"],
    ],
  },
];
function ContentEditor() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const load = useCallback(() => {
    request("content")
      .then((data) => setContent({ ...defaultContent, ...data }))
      .catch((e) => setError(errorMessage(e)));
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  if (!content)
    return (
      <section className="admin-panel">
        <p role="status">{error || "Loading your site content…"}</p>
        {error && (
          <button className="button" onClick={load}>
            Retry
          </button>
        )}
      </section>
    );
  function setField(key: TextKey, value: string) {
    setContent((c) => c && { ...c, [key]: value });
    setStatus("");
  }
  return (
    <form
      className="admin-content"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        setStatus("");
        try {
          await request("content", "PATCH", content);
          setStatus("Your website content has been saved.");
          router.refresh();
        } catch (e) {
          setError(errorMessage(e));
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="admin-save">
        <div>
          <strong>Make it your own</strong>
          <p>Changes appear on the storefront after saving.</p>
        </div>
        <button className="button" disabled={busy}>
          {busy ? "Saving…" : "Save website changes →"}
        </button>
      </div>
      <p className="admin-error" role="alert">
        {error}
      </p>
      <p role="status" className="admin-success">
        {status}
      </p>
      {sections.map((section, i) => (
        <details key={section.title} className="admin-panel" open={i < 2}>
          <summary>{section.title}</summary>
          <div className="admin-content-fields">
            {section.fields.map(([key, label, type]) =>
              type === "image" ? (
                <ImageUpload
                  key={key}
                  value={content[key]}
                  label={label}
                  onChange={(value) => setField(key, value)}
                />
              ) : (
                <label key={key}>
                  {label}
                  {type === "area" ? (
                    <textarea
                      rows={key === "returnsText" ? 10 : 4}
                      value={content[key]}
                      maxLength={10000}
                      onChange={(e) => setField(key, e.target.value)}
                    />
                  ) : (
                    <input
                      value={content[key]}
                      maxLength={254}
                      type={key === "contactEmail" ? "email" : "text"}
                      onChange={(e) => setField(key, e.target.value)}
                    />
                  )}
                </label>
              ),
            )}
          </div>
        </details>
      ))}
      <details className="admin-panel">
        <summary>Frequently asked questions</summary>
        <div className="admin-content-fields">
          {content.faqs.map((faq, index) => (
            <div className="admin-repeat" key={index}>
              <label>
                Question
                <input
                  required
                  maxLength={250}
                  value={faq.question}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      faqs: content.faqs.map((f, i) =>
                        i === index ? { ...f, question: e.target.value } : f,
                      ),
                    })
                  }
                />
              </label>
              <label>
                Answer
                <textarea
                  required
                  maxLength={2000}
                  value={faq.answer}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      faqs: content.faqs.map((f, i) =>
                        i === index ? { ...f, answer: e.target.value } : f,
                      ),
                    })
                  }
                />
              </label>
              <button
                type="button"
                className="admin-secondary"
                onClick={() =>
                  setContent({
                    ...content,
                    faqs: content.faqs.filter((_, i) => i !== index),
                  })
                }
              >
                Remove question
              </button>
            </div>
          ))}
          <button
            type="button"
            className="admin-secondary"
            disabled={content.faqs.length >= 30}
            onClick={() =>
              setContent({
                ...content,
                faqs: [...content.faqs, { question: "", answer: "" }],
              })
            }
          >
            + Add question
          </button>
        </div>
      </details>
      <details className="admin-panel">
        <summary>Size chart (centimetres)</summary>
        <div className="admin-content-fields">
          {content.sizeChart.map((row, index) => (
            <div className="admin-size-row" key={index}>
              {(["size", "bust", "waist", "hips"] as const).map((key) => (
                <label key={key}>
                  {key}
                  <input
                    required={key === "size"}
                    maxLength={key === "size" ? 30 : 250}
                    value={row[key]}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        sizeChart: content.sizeChart.map((r, i) =>
                          i === index ? { ...r, [key]: e.target.value } : r,
                        ),
                      })
                    }
                  />
                </label>
              ))}
              <button
                type="button"
                className="admin-secondary"
                onClick={() =>
                  setContent({
                    ...content,
                    sizeChart: content.sizeChart.filter((_, i) => i !== index),
                  })
                }
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="admin-secondary"
            disabled={content.sizeChart.length >= 30}
            onClick={() =>
              setContent({
                ...content,
                sizeChart: [
                  ...content.sizeChart,
                  { size: "", bust: "", waist: "", hips: "" },
                ],
              })
            }
          >
            + Add size
          </button>
        </div>
      </details>
    </form>
  );
}

type CustomDesignLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  measurements: string;
  notes: string;
  imageUrl: string;
  imageBytes: number;
  status: "new" | "contacted" | "closed";
  createdAt: string;
  updatedAt: string;
};

const leadStatusLabel = { new: "New", contacted: "Contacted", closed: "Closed" };

function LeadsManager({ onBusy }: { onBusy: (busy: boolean) => void }) {
  const [leads, setLeads] = useState<CustomDesignLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<CustomDesignLead | null>(null);
  const [deleting, setDeleting] = useState<CustomDesignLead | null>(null);
  const load = useCallback(() => {
    request("custom-designs")
      .then((data) => { setLeads(Array.isArray(data) ? data : []); setError(""); })
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);
  const query = search.trim().toLowerCase();
  const filtered = leads.filter((lead) => !query || [lead.name, lead.email, lead.phone, lead.deliveryAddress, lead.measurements, lead.notes, lead.status].some((value) => value?.toLowerCase().includes(query)));

  return (
    <>
      <p className="admin-error" role="alert">{error}</p>
      <p className="admin-success" role="status">{notice}</p>
      <section className="admin-panel">
        <div className="admin-toolbar">
          <h2>Custom design leads</h2>
          <span>{filtered.length} {filtered.length === 1 ? "lead" : "leads"}</span>
        </div>
        <div className="admin-search">
          <input aria-label="Search leads" placeholder="Search leads…" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        {loading ? <p role="status">Loading leads…</p> : (
          <div className="table-wrap">
            <table className="admin-table admin-leads-table">
              <thead><tr><th>Date</th><th>Customer</th><th>Contact</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id}>
                    <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td><strong>{lead.name}</strong><small>{lead.deliveryAddress}</small></td>
                    <td><a href={`mailto:${lead.email}`}>{lead.email}</a><small><a href={`tel:${lead.phone}`}>{lead.phone}</a></small></td>
                    <td><span className={`lead-status lead-status-${lead.status}`}>{leadStatusLabel[lead.status]}</span></td>
                    <td><div className="admin-row-actions"><button className="admin-secondary" onClick={() => { setEditing(lead); setNotice(""); }}>View / edit</button><button className="admin-danger" onClick={() => setDeleting(lead)}>Delete</button></div></td>
                  </tr>
                ))}
                {!filtered.length && <tr><td colSpan={5}>No matching leads found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {editing && (
        <div className="admin-lead-overlay" role="dialog" aria-modal="true" aria-labelledby="lead-editor-title">
          <form className="admin-lead-modal" onSubmit={async (event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            onBusy(true); setError("");
            try {
              await request(`custom-designs/${editing.id}`, "PATCH", Object.fromEntries(form));
              setEditing(null); setNotice("Lead updated."); await load();
            } catch (e) { setError(errorMessage(e)); }
            finally { onBusy(false); }
          }}>
            <div className="admin-toolbar"><div><h2 id="lead-editor-title">Lead details</h2><p>Submitted {new Date(editing.createdAt).toLocaleString()}</p></div><button type="button" className="admin-secondary" onClick={() => setEditing(null)}>Close</button></div>
            <div className="admin-lead-detail-grid">
              <a className="admin-lead-image" href={editing.imageUrl} target="_blank" rel="noreferrer" title="Open full-size image in a new tab"><Image src={editing.imageUrl} loader={({ src }) => src} unoptimized width={800} height={1000} alt={`Custom dress reference sent by ${editing.name}`} /><span>Open full-size image ↗</span></a>
              <div className="admin-editor admin-lead-fields">
                <div className="admin-fields"><label>Name<input name="name" required maxLength={100} defaultValue={editing.name} /></label><label>Status<select name="status" defaultValue={editing.status}><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select></label></div>
                <div className="admin-fields"><label>Email<input name="email" type="email" required maxLength={254} defaultValue={editing.email} /></label><label>Phone<input name="phone" type="tel" required maxLength={30} defaultValue={editing.phone} /></label></div>
                <label>Delivery address<textarea name="deliveryAddress" required minLength={10} maxLength={500} rows={3} defaultValue={editing.deliveryAddress} /></label>
                <label>Measurements<textarea name="measurements" maxLength={1000} rows={4} defaultValue={editing.measurements} /></label>
                <label>Notes<textarea name="notes" maxLength={2000} rows={4} defaultValue={editing.notes} /></label>
              </div>
            </div>
            <div className="admin-row-actions admin-lead-modal-actions"><button className="button">Save changes</button><button type="button" className="admin-danger" onClick={() => { setEditing(null); setDeleting(editing); }}>Delete lead</button></div>
          </form>
        </div>
      )}
      {deleting && (
        <div className="admin-confirm" role="alertdialog" aria-modal="true" aria-labelledby="delete-lead-title"><div><h2 id="delete-lead-title">Delete this lead?</h2><p>“{deleting.name}” and their uploaded design image will be permanently removed from the database and Cloudflare R2. This cannot be undone.</p><div className="admin-row-actions"><button className="admin-secondary" onClick={() => setDeleting(null)}>Keep lead</button><button className="button" onClick={async () => { onBusy(true); setError(""); try { await request(`custom-designs/${deleting.id}`, "DELETE"); setDeleting(null); setNotice("Lead and design image deleted."); await load(); } catch (e) { setError(errorMessage(e)); } finally { onBusy(false); } }}>Delete lead and image</button></div></div></div>
      )}
    </>
  );
}

export function AdminDashboard({ username }: { username: string }) {
  const [tab, setTab] = useState<AdminSection>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<Product | null | undefined>();
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const load = useCallback(
    () =>
      request(
        `products?limit=20&offset=${offset}&q=${encodeURIComponent(search)}`,
      )
        .then((data) => {
          setProducts(data);
          setError("");
        })
        .catch((e) => setError(errorMessage(e)))
        .finally(() => setLoading(false)),
    [offset, search],
  );
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    const expired = () => {
      router.replace("/admin/login");
      router.refresh();
    };
    window.addEventListener("admin-session-expired", expired);
    return () => window.removeEventListener("admin-session-expired", expired);
  }, [router]);
  return (
    <AdminFrame
      username={username}
      section={tab}
      busy={busy}
      onNavigate={(next) => {
        if (next === tab) return true;
        if (
          editing !== undefined &&
          !window.confirm("Discard unsaved product changes?")
        )
          return false;
        setEditing(undefined);
        setNotice("");
        setTab(next);
        return true;
      }}
      onLogout={async () => {
        setBusy(true);
        try {
          await request("auth/logout", "POST", {});
          router.replace("/admin/login");
          router.refresh();
        } catch (e) {
          setError(errorMessage(e));
        } finally {
          setBusy(false);
        }
      }}
    >
      <p className="admin-error" role="alert">
        {error}
      </p>
      <p className="admin-success" role="status">
        {notice}
      </p>
      {tab === "settings" ? (
        <PasswordForm />
      ) : tab === "leads" ? (
        <LeadsManager onBusy={setBusy} />
      ) : tab === "content" ? null : editing !== undefined ? (
        <ProductEditor
          key={editing?.id || "new"}
          product={editing}
          onClose={() => {
            if (window.confirm("Discard unsaved changes?"))
              setEditing(undefined);
          }}
          onSaved={() => {
            setEditing(undefined);
            setNotice("Product saved.");
            load();
            router.refresh();
          }}
        />
      ) : (
        <section className="admin-panel">
          <div className="admin-toolbar">
            <h2>Your collection</h2>
            <button
              className="button"
              onClick={() => {
                setEditing(null);
                setNotice("");
              }}
            >
              + Add product
            </button>
          </div>
          <form
            className="admin-search"
            onSubmit={(e) => {
              e.preventDefault();
              setOffset(0);
              setSearch(String(new FormData(e.currentTarget).get("q") || ""));
            }}
          >
            <input
              name="q"
              aria-label="Search products"
              placeholder="Find a product…"
            />
            <button className="admin-secondary">Search</button>
          </form>
          {loading ? (
            <p role="status">Loading products…</p>
          ) : (
            <>
              <div className="table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Sizes</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <strong>{p.name}</strong>
                          <small>
                            {p.color}
                            {!p.image ? " · No image" : ""}
                          </small>
                        </td>
                        <td>{p.category}</td>
                        <td>{p.sizes.join(", ")}</td>
                        <td>
                          {money(p.price)}
                          <small>
                            USD:{" "}
                            {p.priceUsd == null
                              ? "Not set"
                              : p.priceUsd.toFixed(2)}
                          </small>
                          <small>
                            TRY:{" "}
                            {p.priceTry == null
                              ? "Not set"
                              : p.priceTry.toFixed(2)}
                          </small>
                        </td>
                        <td>
                          <div className="admin-row-actions">
                            <button
                              className="admin-secondary"
                              onClick={() => {
                                setEditing(p);
                                setNotice("");
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="admin-danger"
                              onClick={() => setDeleting(p)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {products.length === 0 && (
                <div className="empty">
                  <h2>
                    {search
                      ? "No matching pieces."
                      : "Your collection starts here."}
                  </h2>
                  <p>
                    {search
                      ? "Try a different search."
                      : "Add your first product to bring your shop to life."}
                  </p>
                </div>
              )}
              <div className="admin-pagination">
                <button
                  className="admin-secondary"
                  disabled={offset === 0}
                  onClick={() => setOffset(Math.max(0, offset - 20))}
                >
                  ← Previous
                </button>
                <span>Page {offset / 20 + 1}</span>
                <button
                  className="admin-secondary"
                  disabled={products.length < 20}
                  onClick={() => setOffset(offset + 20)}
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </section>
      )}
      {deleting && (
        <div
          className="admin-confirm"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-title"
        >
          <div>
            <h2 id="delete-title">Delete this piece?</h2>
            <p>
              “{deleting.name}” will be removed from the shop. This cannot be
              undone. Its uploaded image will be removed if it is not used
              elsewhere.
            </p>
            <div className="admin-row-actions">
              <button
                className="admin-secondary"
                autoFocus
                disabled={busy}
                onClick={() => setDeleting(null)}
              >
                Keep product
              </button>
              <button
                className="button"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await request(`products/${deleting.id}`, "DELETE");
                    setDeleting(null);
                    setNotice("Product deleted.");
                    await load();
                    router.refresh();
                  } catch (e) {
                    setError(errorMessage(e));
                    setDeleting(null);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy ? "Deleting…" : "Delete product"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div hidden={tab !== "content"}>
        <ContentEditor />
      </div>
    </AdminFrame>
  );
}
