import { LogOut, X } from 'lucide-react';
import type { NavItem, Role, UserProfile } from '../../types';
import { Brand } from '../common/Brand';

type SidebarProps = {
  role: Role;
  profile: UserProfile;
  items: NavItem[];
  activeTab: string;
  open: boolean;
  mobileOpen: boolean;
  onNavigate: (tab: string) => void;
  onCloseMobile: () => void;
  onLogout: () => void;
};

export function Sidebar({ role, profile, items, activeTab, open, mobileOpen, onNavigate, onCloseMobile, onLogout }: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex border-r border-slate-200 bg-white transition-all duration-200 ${
        open ? 'lg:w-72' : 'lg:w-20'
      } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} w-72`}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4">
          <Brand collapsed={!open} role={role} />
          <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden" onClick={onCloseMobile} aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {items.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  active ? 'bg-brand-50 font-semibold text-brand-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                } ${!open ? 'lg:justify-center' : ''}`}
                onClick={() => onNavigate(item.id)}
                title={item.label}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className={`${!open ? 'lg:hidden' : ''}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="shrink-0 border-t border-slate-100 p-3">
          <div className={`flex items-center gap-3 rounded-lg bg-slate-50 p-3 ${!open ? 'lg:justify-center' : ''}`}>
            <img className="h-10 w-10 rounded-full object-cover" src={profile.avatar} alt={profile.name} />
            <div className={`min-w-0 flex-1 ${!open ? 'lg:hidden' : ''}`}>
              <p className="truncate text-sm font-bold text-slate-800">{profile.name}</p>
              <p className="truncate text-xs text-slate-500">{profile.email}</p>
            </div>
            <button className={`rounded-lg p-2 text-rose-600 hover:bg-rose-50 ${!open ? 'lg:hidden' : ''}`} onClick={onLogout} aria-label="Logout" title="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
