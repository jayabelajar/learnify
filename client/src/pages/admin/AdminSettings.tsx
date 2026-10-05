import { useState } from 'react';
import { Panel } from '../../components/common/Panel';

export function AdminSettings() {
  return (
    <section className="grid gap-5 md:grid-cols-2">
      <Panel title="Platform Settings">
        <Toggle label="Require email verification" />
        <Toggle label="Allow public registration" />
        <Toggle label="Instructor course approval" />
      </Panel>
      <Panel title="Security">
        <Toggle label="JWT session monitoring" />
        <Toggle label="Admin notification digest" />
        <Toggle label="Maintenance mode" />
      </Panel>
    </section>
  );
}

function Toggle({ label }: { label: string }) {
  const [checked, setChecked] = useState(true);
  return (
    <button className="mb-3 flex w-full items-center justify-between rounded-lg border border-slate-100 p-3 text-left text-sm font-semibold" onClick={() => setChecked((value) => !value)}>
      <span>{label}</span>
      <span className={`h-6 w-11 rounded-full p-1 transition ${checked ? 'bg-brand-600' : 'bg-slate-300'}`}>
        <span className={`block h-4 w-4 rounded-full bg-white transition ${checked ? 'translate-x-5' : ''}`} />
      </span>
    </button>
  );
}
