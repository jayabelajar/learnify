import { Panel } from './Panel';

type DataTableProps = {
  title: string;
  headers: string[];
  rows: Array<Array<string | number>>;
};

export function DataTable({ title, headers, rows }: DataTableProps) {
  return (
    <Panel title={title}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-400">
            <tr>
              {headers.map((header) => (
                <th key={header} className="py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="py-4 text-slate-700 first:font-semibold">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
