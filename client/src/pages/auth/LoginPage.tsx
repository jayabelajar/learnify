import { useState } from 'react';
import type { Role } from '../../types';
import { roleProfiles } from '../../data/users';
import { Brand } from '../../components/common/Brand';
import { Input } from '../../components/common/FormControls';

type LoginPageProps = {
  role: Role;
  onLogin: (role: Role, email: string, password: string) => void;
  onSwitch: (role: Role) => void;
};

export function LoginPage({ role, onLogin, onSwitch }: LoginPageProps) {
  const [email, setEmail] = useState(roleProfiles[role].email);
  const [password, setPassword] = useState(roleProfiles[role].password);

  function switchRole(nextRole: Role) {
    setEmail(roleProfiles[nextRole].email);
    setPassword(roleProfiles[nextRole].password);
    onSwitch(nextRole);
  }

  return (
    <section className="grid min-h-[calc(100vh-8rem)] place-items-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Brand role={role} />
        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">{role} login</p>
          <h1 className="mt-1 text-2xl font-bold">Welcome to Learnify</h1>
          <p className="mt-2 text-sm text-slate-500">Use the role-specific login page for a focused dashboard experience.</p>
        </div>
        <div className="mt-6 grid gap-4">
          <Input label="Email" value={email} onChange={setEmail} />
          <Input label="Password" type="password" value={password} onChange={setPassword} />
          <button className="rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700" onClick={() => onLogin(role, email, password)}>
            Login as {role}
          </button>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {(['student', 'instructor', 'admin'] as Role[]).map((item) => (
            <button key={item} className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold capitalize hover:bg-slate-50" onClick={() => switchRole(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
