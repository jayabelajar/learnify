import { BookOpen } from 'lucide-react';
import type { Role } from '../../types';

type BrandProps = {
  collapsed?: boolean;
  role?: Role;
};

export function Brand({ collapsed = false, role }: BrandProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm shadow-indigo-200">
        <BookOpen className="h-5 w-5" />
      </div>
      <div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
        <p className="truncate text-lg font-bold leading-none tracking-tight">Learnify</p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {role ? `${role} portal` : 'Learning platform'}
        </p>
      </div>
    </div>
  );
}
