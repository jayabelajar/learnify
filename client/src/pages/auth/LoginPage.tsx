import { useState } from 'react';
import type { Role } from '../../types';
import { roleProfiles } from '../../data/users';
import { Brand } from '../../components/common/Brand';
import { Input } from '../../components/common/FormControls';
import { BookOpen, GraduationCap, ShieldCheck } from 'lucide-react';

type LoginPageProps = {
  role: Role;
  onLogin: (role: Role, email: string, password: string) => void;
  onRegister: (role: Role, payload: { name: string; email: string; password: string }) => void;
  onSwitch: (role: Role) => void;
};

export function LoginPage({ role, onLogin, onRegister, onSwitch }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(roleProfiles[role].email);
  const [password, setPassword] = useState(roleProfiles[role].password);

  function switchRole(nextRole: Role) {
    setEmail(roleProfiles[nextRole].email);
    setPassword(roleProfiles[nextRole].password);
    onSwitch(nextRole);
  }

  return (
    <section className="grid min-h-[calc(100vh-8rem)] place-items-center">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Brand role={role} />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">{role} onboarding</p>
            <h1 className="mt-1 text-2xl font-bold">Welcome to Learnify</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Pilih role, lalu login demo atau register akun baru. Setelah berhasil, Learnify otomatis mengarah ke dashboard sesuai role.</p>
            <div className="mt-5 grid gap-3">
              {[
                ['student', BookOpen, 'Enroll, learn, submit assignments, take quizzes.'],
                ['instructor', GraduationCap, 'Create courses, review submissions, publish quizzes.'],
                ['admin', ShieldCheck, 'Manage users, categories, reports, and audit logs.']
              ].map(([item, Icon, desc]: any) => (
                <button key={item} className={`rounded-xl border p-4 text-left transition ${role === item ? 'border-brand-200 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'}`} onClick={() => switchRole(item)}>
                  <div className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-5 w-5 text-brand-600" />
                    <div>
                      <p className="text-sm font-bold capitalize text-slate-900">{item}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-white p-1">
              {(['login', 'register'] as const).map((item) => (
                <button key={item} className={`rounded-lg px-3 py-2 text-sm font-semibold capitalize ${mode === item ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`} onClick={() => setMode(item)}>
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-5 grid gap-4">
              {mode === 'register' && <Input label="Full Name" value={name} onChange={setName} />}
              <Input label="Email" value={email} onChange={setEmail} />
              <Input label="Password" type="password" value={password} onChange={setPassword} />
              <button
                className="rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700"
                onClick={() => (mode === 'login' ? onLogin(role, email, password) : onRegister(role, { name: name || 'Learnify User', email, password }))}
              >
                {mode === 'login' ? `Login as ${role}` : `Create ${role} account`}
              </button>
              {mode === 'login' && <p className="text-xs text-slate-500">Demo credential otomatis terisi sesuai role yang dipilih.</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
