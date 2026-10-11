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
  if (pathname === "/checkout")
    return <div className="storefront checkout-site"><a href="#main" className="skip-link">Skip to checkout</a><main id="main">{children}</main></div>;
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
