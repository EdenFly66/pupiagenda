import type { ReactNode } from "react";

type SectionCardProps = {
  children: ReactNode;
  className?: string;
};

export function SectionCard({ children, className = "" }: SectionCardProps) {
  return (
    <section
      className={`rounded-lg border border-border bg-surface p-5 shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}
