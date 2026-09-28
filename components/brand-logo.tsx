"use client";
import Image from "next/image";
import { createContext, useContext, type ReactNode } from "react";

const LogoContext = createContext("");
export function BrandProvider({ logo, children }: { logo: string; children: ReactNode }) {
  return <LogoContext.Provider value={logo}>{children}</LogoContext.Provider>;
}

export function BrandLogo({ priority = false, src }: { priority?: boolean; src?: string }) {
  const savedLogo = useContext(LogoContext);
  const candidate = src ?? savedLogo;
  const valid = /^\/images\/[a-zA-Z0-9._-]+$/.test(candidate) || (URL.canParse(candidate) && new URL(candidate).protocol === "https:");
  const image = valid ? candidate : "/images/rikkyloops-logo.jpeg";
  return <Image className="brand-logo" src={image} unoptimized={image.startsWith("https:")} alt="RikkyLoops — handmade with love" width={1181} height={1181} sizes="(max-width: 700px) 72px, 112px" priority={priority}/>;
}
