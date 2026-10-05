import { Edit3, LogOut } from 'lucide-react';
import type { Role, UserProfile } from '../../../types';
import { FloatingPanel } from '../FloatingPanel';

type ProfileMenuProps = {
  profile: UserProfile;
  onNavigate: (tab: string) => void;
  onLoginAs: (role: Role) => void;
  onLogout: () => void;
};

export function ProfileMenu({ profile, onNavigate, onLoginAs, onLogout }: ProfileMenuProps) {
  return (
    <FloatingPanel className="right-3 top-16 w-[min(320px,calc(100vw-24px))]">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <img className="h-12 w-12 rounded-full object-cover" src={profile.avatar} alt={profile.name} />
        <div className="min-w-0">
          <p className="truncate font-bold">{profile.name}</p>
          <p className="truncate text-sm text-slate-500">{profile.email}</p>
          <span className="mt-1 inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold capitalize text-brand-700">{profile.role}</span>
        </div>
      </div>
      <div className="mt-3 grid gap-2">
        <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-50" onClick={() => onNavigate('profile')}>
          <Edit3 className="h-4 w-4" /> Edit Profile
        </button>
        <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50" onClick={onLogout}>
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
      <div className="mt-3 border-t border-slate-100 pt-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Login pages</p>
        <div className="grid grid-cols-3 gap-2">
          {(['student', 'instructor', 'admin'] as Role[]).map((item) => (
            <button key={item} className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold capitalize hover:bg-slate-50" onClick={() => onLoginAs(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </FloatingPanel>
  );
}
