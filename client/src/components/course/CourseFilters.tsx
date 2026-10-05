import { Search } from 'lucide-react';
import { Select } from '../common/FormControls';

type CourseFiltersProps = {
  search: string;
  category: string;
  level: string;
  completion?: string;
  showCompletion?: boolean;
  onSearch: (value: string) => void;
  onCategory: (value: string) => void;
  onLevel: (value: string) => void;
  onCompletion?: (value: string) => void;
};

export function CourseFilters({ search, category, level, completion = 'All', showCompletion = false, onSearch, onCategory, onLevel, onCompletion }: CourseFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_180px]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-brand-500"
          placeholder="Search courses..."
        />
      </div>
      <Select value={category} values={['All', 'Web Dev', 'Backend', 'Data Science', 'Design']} onChange={onCategory} />
      <Select value={level} values={['All', 'Beginner', 'Intermediate', 'Advanced']} onChange={onLevel} />
      {showCompletion && <Select value={completion} values={['All', 'Completed', 'In Progress', 'Not Started']} onChange={onCompletion || (() => null)} />}
    </div>
  );
}
