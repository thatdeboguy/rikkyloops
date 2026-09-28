"use client";
import { usePathname } from "next/navigation";
import { Header } from "@/components/store";
export function SiteShell({
  children,
  footer,
  announcement,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
  announcement: string;
}) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/"))
    return <main id="main">{children}</main>;
  return (
    <div className="storefront">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header announcement={announcement} />
      <main id="main">{children}</main>
      {footer}
    </div>
  );
}
