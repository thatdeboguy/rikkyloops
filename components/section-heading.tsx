import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, title, children }: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <span className="mb-3 block text-xs font-semibold tracking-[0.18em] text-[var(--plum)]">{eyebrow}</span>
        <h2 className="m-0! text-[clamp(2rem,3.5vw,3rem)]! tracking-tight!">{title}</h2>
      </div>
      {children}
    </div>
  );
}
