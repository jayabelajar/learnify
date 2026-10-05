import type { ReactNode } from 'react';

type PanelProps = {
  title?: string | null;
  children: ReactNode;
  className?: string;
};

export function Panel({ title = null, children, className = '' }: PanelProps) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {title && <h3 className="mb-4 text-base font-bold">{title}</h3>}
      {children}
    </section>
  );
}
