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
  formFields?: Array<{ name: string; label: string; type?: string; placeholder?: string }>;
  onCreate?: (payload: Record<string, string>) => void | Promise<void>;
  rowActions?: Array<{ label: string; onClick: (rowIndex: number) => void | Promise<void>; danger?: boolean }>;
};

export function PlatformResourcePage({ title, description, primaryAction = 'Create', headers, rows, stats = [], formFields = [], onCreate, rowActions = [] }: PlatformResourcePageProps) {
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
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
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700" onClick={() => setFormOpen((value) => !value)}>
            <Plus className="h-4 w-4" />
            {primaryAction}
          </button>
        </div>
      </Panel>

      {formOpen && formFields.length > 0 && (
        <Panel title={primaryAction}>
          <form
            className="grid gap-3 md:grid-cols-2"
            onSubmit={async (event) => {
              event.preventDefault();
              await onCreate?.(form);
              setForm({});
              setFormOpen(false);
            }}
          >
            {formFields.map((field) => (
              <label key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <span className="text-xs font-semibold text-slate-500">{field.label}</span>
                {field.type === 'textarea' ? (
                  <textarea
                    className="mt-1 min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-50"
                    placeholder={field.placeholder}
                    value={form[field.name] || ''}
                    onChange={(event) => setForm((items) => ({ ...items, [field.name]: event.target.value }))}
                  />
                ) : (
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-50"
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    value={form[field.name] || ''}
                    onChange={(event) => setForm((items) => ({ ...items, [field.name]: event.target.value }))}
                  />
                )}
              </label>
            ))}
            <div className="flex justify-end gap-2 md:col-span-2">
              <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600" onClick={() => setFormOpen(false)}>
                Cancel
              </button>
              <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
                Save
              </button>
            </div>
          </form>
        </Panel>
      )}

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

      {rowActions.length ? (
        <Panel title={`${title} List`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase text-slate-400">
                <tr>
                  {headers.map((header) => (
                    <th key={header} className="py-3">{header}</th>
                  ))}
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.map((row, index) => (
                  <tr key={index}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="py-4 text-slate-700 first:font-semibold">{cell}</td>
                    ))}
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {rowActions.map((action) => (
                          <button key={action.label} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${action.danger ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`} onClick={() => action.onClick(rows.indexOf(row))}>
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      ) : (
        <DataTable title={`${title} List`} headers={headers} rows={filteredRows} />
      )}
    </section>
  );
}
