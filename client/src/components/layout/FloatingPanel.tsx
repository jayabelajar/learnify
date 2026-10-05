import type { ReactNode } from 'react';

type FloatingPanelProps = {
  children: ReactNode;
  className?: string;
};

export function FloatingPanel({ children, className = '' }: FloatingPanelProps) {
  return <div className={`absolute rounded-xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 ${className}`}>{children}</div>;
}
