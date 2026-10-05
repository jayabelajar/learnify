import { BookOpenCheck, ClipboardList, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '../../components/common/Badge';
import { DataTable } from '../../components/common/DataTable';
import { KpiGrid } from '../../components/common/KpiGrid';
import { Panel } from '../../components/common/Panel';

type PlatformResourcePageProps = {
  title: string;
  description: string;
  primaryAction?: string;
  headers: string[];
  rows: Array<Array<string | number>>;
  stats?: Array<[string, string | number]>;
};

export function PlatformResourcePage({ title, description, primaryAction = 'Create', headers, rows, stats = [] }: PlatformResourcePageProps) {
  const [query, setQuery] = useState('');
  const filteredRows = useMemo(() => {
    if (!query.trim()) return rows;
    return rows.filter((row) => row.join(' ').toLowerCase().includes(query.toLowerCase()));
  }, [query, rows]);

  const cards = [
    [stats[0]?.[0] || 'Total Records', stats[0]?.[1] ?? rows.length, ClipboardList, 'bg-brand-50 text-brand-600'],
    [stats[1]?.[0] || 'Active', stats[1]?.[1] ?? rows.length, BookOpenCheck, 'bg-emerald-50 text-emerald-600'],
    [stats[2]?.[0] || 'Filtered', stats[2]?.[1] ?? filteredRows.length, Search, 'bg-amber-50 text-amber-600']
  ] as const;

  return (
    <section className="space-y-6">
      <Panel>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge tone="indigo">Fullstack Module</Badge>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">{description}</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700">
            <Plus className="h-4 w-4" />
            {primaryAction}
          </button>
        </div>
      </Panel>

      <KpiGrid cards={cards as any} />

      <Panel>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-50"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </Panel>

      <DataTable title={`${title} List`} headers={headers} rows={filteredRows} />
    </section>
  );
}
