import type { ReactNode } from 'react';

const tones: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-700',
  indigo: 'bg-brand-50 text-brand-700',
  gray: 'bg-slate-100 text-slate-600'
};

type BadgeProps = {
  children: ReactNode;
  tone?: 'green' | 'indigo' | 'gray' | string;
};

export function Badge({ children, tone = 'gray' }: BadgeProps) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${tones[tone] || tones.gray}`}>{children}</span>;
}
