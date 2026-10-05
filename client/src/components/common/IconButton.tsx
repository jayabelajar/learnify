import type { LucideIcon } from 'lucide-react';

type IconButtonProps = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  danger?: boolean;
};

export function IconButton({ label, icon: Icon, onClick, danger = false }: IconButtonProps) {
  return (
    <button
      className={`rounded-lg p-2 ${danger ? 'text-rose-600 hover:bg-rose-50' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
