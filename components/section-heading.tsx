import type { ReactNode } from "react";

export function PageHeading({ eyebrow, title, description }: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
}) {
  return (
    <header className="border-b border-line bg-[#fff0f5] px-6 py-12 text-center sm:py-16">
      <span className="mb-4 block text-xs font-semibold tracking-[0.18em] text-brand">{eyebrow}</span>
      <h1 className="mb-5 text-[clamp(2.5rem,5vw,3.5rem)] tracking-tight">{title}</h1>
      <p className="mx-auto mb-0 max-w-xl leading-7">{description}</p>
    </header>
  );
}

export function SectionHeading({ eyebrow, title, children }: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <span className="mb-3 block text-xs font-semibold tracking-[0.18em] text-brand">{eyebrow}</span>
        <h2 className="m-0! text-[clamp(2rem,3.5vw,3rem)]! tracking-tight!">{title}</h2>
      </div>
      {children}
    </div>
  );
}
