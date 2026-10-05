import {
  Bell,
  ChevronDown,
  Edit3,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search
} from 'lucide-react';
import type { Role, SearchResult, UserProfile } from '../../types';
import { notifications } from '../../data/users';
import { FloatingPanel } from './FloatingPanel';

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

      {(searchOpen || search) && (
        <FloatingPanel className="left-3 right-3 top-16 md:left-20 md:right-auto md:w-[440px]">
          <div className="md:hidden">
            <input
              autoFocus
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
              placeholder="Search anything..."
            />
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Shortcut menu</p>
          <div className="grid gap-1">
            {(searchResults.length
              ? searchResults
              : [
                  { id: 'profile', title: 'Open profile', type: 'Menu', target: 'profile' },
                  {
                    id: 'learning',
                    title: role === 'student' ? 'My Learning' : 'Courses',
                    type: 'Menu',
                    target: role === 'student' ? 'my-learning' : role === 'admin' ? 'admin-users' : 'course-mgmt'
                  },
                  {
                    id: 'analytics',
                    title: role === 'student' ? 'Quiz Results' : 'Analytics',
                    type: 'Menu',
                    target: role === 'student' ? 'quiz-results' : role === 'admin' ? 'admin-reports' : 'analytics'
                  }
                ]).map((item) => (
              <button key={`${item.type}-${item.id}`} className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50" onClick={() => onNavigate(item.target)}>
                <span className="font-medium">{item.title}</span>
                <span className="text-xs text-slate-400">{item.type}</span>
              </button>
            ))}
          </div>
        </FloatingPanel>
      )}

      {notificationOpen && (
        <FloatingPanel className="right-3 top-16 w-[min(360px,calc(100vw-24px))]">
          <p className="mb-3 font-bold">Notifications</p>
          <div className="space-y-2">
            {notifications.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-100 p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <span className="text-xs text-slate-400">{item.time}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{item.body}</p>
              </div>
            ))}
          </div>
        </FloatingPanel>
      )}

      {profileOpen && (
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
            <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50">
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
      )}
    </header>
  );
}
