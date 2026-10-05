import {
  Bell,
  ChevronDown,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search
} from 'lucide-react';
import type { Role, SearchResult, UserProfile } from '../../types';
import { NotificationsPanel } from './topbar/NotificationsPanel';
import { ProfileMenu } from './topbar/ProfileMenu';
import { SearchPanel } from './topbar/SearchPanel';

type TopbarProps = {
  role: Role;
  profile: UserProfile;
  sidebarOpen: boolean;
  notificationOpen: boolean;
  profileOpen: boolean;
  searchOpen: boolean;
  search: string;
  searchResults: SearchResult[];
  onToggleSidebar: () => void;
  onOpenMobileSidebar: () => void;
  onSearch: (value: string) => void;
  onToggleSearch: () => void;
  onToggleNotifications: () => void;
  onToggleProfile: () => void;
  onNavigate: (tab: string) => void;
  onLoginAs: (role: Role) => void;
};

export function Topbar(props: TopbarProps) {
  const {
    role,
    profile,
    sidebarOpen,
    notificationOpen,
    profileOpen,
    searchOpen,
    search,
    searchResults,
    onToggleSidebar,
    onOpenMobileSidebar,
    onSearch,
    onToggleSearch,
    onToggleNotifications,
    onToggleProfile,
    onNavigate,
    onLoginAs
  } = props;

  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 md:px-6">
      <div className="flex items-center gap-2">
        <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={onOpenMobileSidebar} aria-label="Open sidebar">
          <Menu className="h-5 w-5" />
        </button>
        <button className="hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:inline-flex" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
        </button>
        <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" onClick={onToggleSearch} aria-label="Open search">
          <Search className="h-5 w-5" />
        </button>
        <div className="relative hidden w-80 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            onFocus={onToggleSearch}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:bg-white"
            placeholder="Search courses, students, menus..."
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100" onClick={onToggleNotifications} aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-600" />
        </button>
        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100" onClick={onToggleProfile} aria-label="Profile menu">
          <img className="h-8 w-8 rounded-full object-cover" src={profile.avatar} alt={profile.name} />
          <span className="hidden text-sm font-semibold md:block">{profile.name}</span>
          <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
        </button>
      </div>

      {(searchOpen || search) && <SearchPanel role={role} search={search} searchResults={searchResults} onSearch={onSearch} onNavigate={onNavigate} />}
      {notificationOpen && <NotificationsPanel />}
      {profileOpen && <ProfileMenu profile={profile} onNavigate={onNavigate} onLoginAs={onLoginAs} />}
    </header>
  );
}
