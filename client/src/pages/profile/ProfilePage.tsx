import { useState } from 'react';
import type { UserProfile } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/FormControls';
import { Panel } from '../../components/common/Panel';

type ProfilePageProps = {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
};

export function ProfilePage({ profile, onSave }: ProfilePageProps) {
  const [form, setForm] = useState(profile);

  return (
    <Panel>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-xl bg-slate-50 p-5 text-center">
          <img className="mx-auto h-28 w-28 rounded-2xl object-cover" src={form.avatar} alt={form.name} />
          <p className="mt-4 text-xl font-bold">{form.name}</p>
          <p className="text-sm text-slate-500">{form.email}</p>
          <Badge tone="indigo">{form.role}</Badge>
        </div>
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSave(form);
          }}
        >
          <Input label="Avatar URL" value={form.avatar} onChange={(value) => setForm({ ...form, avatar: value })} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
            <Input label="Email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Password" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} />
            <Input label="Confirm Password" type="password" value={form.password} onChange={() => null} />
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => setForm(profile)}>
              Reset
            </button>
            <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Save Profile</button>
          </div>
        </form>
      </div>
    </Panel>
  );
}
