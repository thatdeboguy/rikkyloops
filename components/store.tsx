"use client";
import { BrandLogo } from "@/components/brand-logo";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { type Product } from "@/lib/catalog";

import { CurrencySelector, Price, BagSubtotal } from "@/components/currency";

type Item = { product: Product; size: string; quantity: number };
const BagContext = createContext<{
  items: Item[];
  add: (product: Product, size: string) => void;
  update: (id: string, size: string, quantity: number) => void;
}>({ items: [], add: () => {}, update: () => {} });
let memoryBag = "[]";
function subscribeBag(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("rikkyloops-bag", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("rikkyloops-bag", callback);
  };
}
function readBag() {
  try {
    return localStorage.getItem("rikkyloops-bag") || memoryBag;
  } catch {
    return memoryBag;
  }
}
function parseBag(value: string): Item[] {
  try {
    const saved = JSON.parse(value);
    return Array.isArray(saved)
      ? saved.filter(
          (i) =>
            i?.product &&
            typeof i.product.id === "string" &&
            typeof i.product.name === "string" &&
            typeof i.product.price === "number" &&
            i.product.price >= 0 &&
            typeof i.product.image === "string" &&
            typeof i.product.color === "string" &&
            typeof i.size === "string" &&
            Number.isInteger(i.quantity) &&
            i.quantity > 0 &&
            i.quantity <= 20,
        )
      : [];
  } catch {
    return [];
  }
}
export function StoreProvider({ children }: { children: ReactNode }) {
  const saved = useSyncExternalStore(subscribeBag, readBag, () => "[]");
  const items = useMemo(() => parseBag(saved), [saved]);
  function setItems(change: (old: Item[]) => Item[]) {
    memoryBag = JSON.stringify(change(parseBag(readBag())));
    try {
      localStorage.setItem("rikkyloops-bag", memoryBag);
    } catch {}
    window.dispatchEvent(new Event("rikkyloops-bag"));
  }
  function add(product: Product, size: string) {
    setItems((old) => {
      const found = old.find(
        (i) => i.product.id === product.id && i.size === size,
      );
      return found
        ? old.map((i) =>
            i === found ? { ...i, quantity: Math.min(i.quantity + 1, 20) } : i,
          )
        : [...old, { product, size, quantity: 1 }];
    });
  }
  function update(id: string, size: string, quantity: number) {
    setItems((old) =>
      old
        .map((i) =>
          i.product.id === id && i.size === size
            ? { ...i, quantity: Math.max(0, Math.min(20, quantity)) }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }
  return (
    <BagContext.Provider value={{ items, add, update }}>
      {children}
    </BagContext.Provider>
  );
}
export function Icon({ name }: { name: "bag" | "search" | "menu" }) {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {name === "bag" ? (
        <>
          <path d="M5 7h14l1 14H4L5 7Z" />
          <path d="M8 8V6a4 4 0 0 1 8 0v2" />
        </>
      ) : name === "search" ? (
        <>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 5 5" />
        </>
      ) : (
        <path d="M3 6h18M3 12h18M3 18h18" />
      )}
    </svg>
  );
}
export function Header({ announcement }: { announcement?: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="announcement">{announcement}</div>
      <header className="header">
        <Link href="/" className="brand" aria-label="Rikkyloops home">
          <BrandLogo priority />
        </Link>
        <nav
          aria-label="Main navigation"
          className={open ? "navigation open" : "navigation"}
        >
          {[
            ["/", "Home"],
            ["/shop", "Shop"],
            ["/categories", "Categories"],
            ["/#our-story", "Our story"],
            ["/contact", "Contact"],
          ].map(([href, text]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {text}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <CurrencySelector />
          <button
            className="icon-button mobile-menu"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <Icon name="menu" />
          </button>
        </div>
      </header>
    </>
  );
}
export function ProductOptions({ product }: { product: Product }) {
  const [size, setSize] = useState("");
  const [status, setStatus] = useState("");
  const { add } = useContext(BagContext);
  return (
    <div className="product-options">
      <p>
        Colour: <strong>{product.color}</strong>
      </p>
      <div className="split">
        <p>Select your size</p>
        <Link className="text-link" href="/size-guide">
          Size guide ↗
        </Link>
      </div>
      <div className="sizes">
        {product.sizes.map((s) => (
          <button
            key={s}
            aria-pressed={s === size}
            className={s === size ? "selected" : ""}
            onClick={() => {
              setSize(s);
              setStatus("");
            }}
          >
            {s}
          </button>
        ))}
      </div>
      <button
        className="button wide"
        onClick={() => {
          if (!size) {
            setStatus("Please select a size first.");
            return;
          }
          add(product, size);
          setStatus("Added to your bag.");
        }}
      >
        Add to bag <span>↗</span>
      </button>
      <p role="status">
        {status}{" "}
        {status.startsWith("Added") && (
          <Link className="text-link" href="/bag">
            View bag →
          </Link>
        )}
      </p>
    </div>
  );
}
export function Bag() {
  const { items, update } = useContext(BagContext);
  if (!items.length)
    return (
      <div className="empty">
        <h2>A little room for something lovely.</h2>
        <p>Your bag is empty. Find a piece that feels like you.</p>
        <Link className="button" href="/shop">
          Explore the collection ↗
        </Link>
      </div>
    );
  return (
    <div className="bag-layout">
      <div>
        {items.map(({ product, size, quantity }) => (
          <article className="bag-item" key={`${product.id}-${size}`}>
            <div
              className="bag-thumb"
              style={{ backgroundImage: `url("${product.image}")` }}
            />
            <div>
              <Link href={`/shop/${product.id}`}>
                <h3>{product.name}</h3>
              </Link>
              <p>
                {size} · {product.color}
              </p>
              <label>
                Quantity{" "}
                <input
                  aria-label={`Quantity for ${product.name} ${size}`}
                  type="number"
                  min="1"
                  max="20"
                  value={quantity}
                  onChange={(e) => {
                    const q = Number(e.target.value);
                    if (Number.isInteger(q) && q >= 1)
                      update(product.id, size, q);
                  }}
                />
              </label>
              <button
                className="text-button"
                onClick={() => update(product.id, size, 0)}
              >
                Remove
              </button>
            </div>
            <strong>
              <Price product={product} quantity={quantity} />
            </strong>
          </article>
        ))}
      </div>
      <aside className="order-summary">
        <h2>Your bag</h2>
        <div className="split">
          <p>Subtotal</p>
          <strong>
            <BagSubtotal items={items} />
          </strong>
        </div>
        <p>
          This is a preview catalogue. Online ordering is not open yet; no
          payment will be collected.
        </p>
        <Link href="/contact" className="button wide">
          Ask about these pieces ↗
        </Link>
        <Link className="text-link" href="/shop">
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
export function ContactForm() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="contact-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setStatus("");
        const form = e.currentTarget;
        const body = Object.fromEntries(new FormData(form));
        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          const data = await res.json();
          setStatus(data.message);
          if (res.ok) form.reset();
        } catch {
          setStatus("We couldn’t send your message. Please try again shortly.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2>Let’s talk.</h2>
      <label htmlFor="name">Your name</label>
      <input
        id="name"
        name="name"
        autoComplete="name"
        required
        maxLength={100}
        placeholder="First and last name"
      />
      <label htmlFor="email">Email address</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        maxLength={254}
        placeholder="you@example.com"
      />
      <label htmlFor="message">What’s on your mind?</label>
      <textarea
        id="message"
        name="message"
        required
        minLength={10}
        maxLength={5000}
        rows={5}
        placeholder="A question, an idea, or a piece you’ve been dreaming of…"
      />
      <button className="button" disabled={busy}>
        {busy ? "Sending…" : "Send message ↗"}
      </button>
      <p role="status">{status}</p>
    </form>
  );
}
