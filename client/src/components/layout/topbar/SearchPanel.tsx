import type { Role, SearchResult } from '../../../types';
import { FloatingPanel } from '../FloatingPanel';

type SearchPanelProps = {
  role: Role;
  search: string;
  searchResults: SearchResult[];
  onSearch: (value: string) => void;
  onNavigate: (tab: string) => void;
};

export function SearchPanel({ role, search, searchResults, onSearch, onNavigate }: SearchPanelProps) {
  const fallbackResults = [
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
  ];

  return (
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
        {(searchResults.length ? searchResults : fallbackResults).map((item) => (
          <button key={`${item.type}-${item.id}`} className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50" onClick={() => onNavigate(item.target)}>
            <span className="font-medium">{item.title}</span>
            <span className="text-xs text-slate-400">{item.type}</span>
          </button>
        ))}
      </div>
    </FloatingPanel>
  );
}
