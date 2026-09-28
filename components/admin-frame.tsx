"use client";
import { BrandLogo } from "@/components/brand-logo";

import { useState, type ReactNode } from "react";
import Link from "next/link";

export type AdminSection = "products" | "content" | "settings";
const sections = [
  { id: "products", label: "Products", description: "Manage your crochet collection, sizes and prices." },
  { id: "content", label: "Website content", description: "Update the words and images across your storefront." },
  { id: "settings", label: "Account settings", description: "Manage the password you use to access your store." },
] as const;

function SectionIcon({ name }: { name: AdminSection }) {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === "products" ? <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></> : name === "content" ? <><path d="M14 3H5v18h14V8Z"/><path d="M14 3v5h5M8 12h8M8 16h6"/></> : <><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>}
  </svg>;
}

export function AdminFrame({ username, section, onNavigate, onLogout, busy, children }: {
  username: string; section: AdminSection; onNavigate: (section: AdminSection) => boolean;
  onLogout: () => void; busy: boolean; children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const current = sections.find(item => item.id === section)!;
  return <div className="admin-workspace">
    <a className="skip-link" href="#admin-content">Skip to admin content</a>
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand"><BrandLogo priority/><small>ADMIN PANEL</small></div>
      <button className="admin-menu-toggle" aria-label="Toggle admin navigation" aria-expanded={menuOpen} aria-controls="admin-navigation" onClick={() => setMenuOpen(!menuOpen)}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
      <div id="admin-navigation" className={`admin-navigation${menuOpen ? " is-open" : ""}`} onKeyDown={event => { if (event.key === "Escape") { setMenuOpen(false); document.querySelector<HTMLButtonElement>(".admin-menu-toggle")?.focus(); } }}>
        <p className="admin-nav-label">MANAGE YOUR STORE</p>
        <nav aria-label="Admin navigation">{sections.map(item => <button key={item.id} aria-current={section === item.id ? "page" : undefined} onClick={() => { if (onNavigate(item.id)) setMenuOpen(false); }}><SectionIcon name={item.id}/>{item.label}</button>)}</nav>
        <div className="admin-sidebar-footer"><Link href="/" target="_blank" rel="noreferrer">View website <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></Link><small>Handmade, just for you.</small></div>
      </div>
    </aside>
    <div className="admin-main">
      <header className="admin-header"><div className="admin-user"><span className="admin-avatar" aria-hidden="true">{username.slice(0, 1).toUpperCase()}</span><div><strong>{username}</strong><span>Rikkyloops administrator</span></div></div><button className="admin-secondary" disabled={busy} onClick={onLogout}>Sign out</button></header>
      <div className="admin-body" id="admin-content" tabIndex={-1}><div className="admin-heading"><p className="admin-breadcrumb">Store management / {current.label}</p><h1>{current.label}</h1><p>{current.description}</p></div>{children}</div>
    </div>
  </div>;
}
