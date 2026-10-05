import type { LucideIcon } from 'lucide-react';

export type KpiCard = [string, string | number, LucideIcon, string];

type KpiGridProps = {
  cards: KpiCard[];
};

export function KpiGrid({ cards }: KpiGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(([label, value, Icon, color]) => (
        <div key={label} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className={`rounded-xl p-3 ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
