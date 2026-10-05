type ProgressProps = {
  value: number;
};

export function Progress({ value }: ProgressProps) {
  return (
    <div className="mt-3 flex items-center gap-3">
      <div className="h-2 flex-1 rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-brand-600" style={{ width: `${value}%` }} />
      </div>
      <span className="w-10 text-right text-xs font-semibold text-slate-600">{value}%</span>
    </div>
  );
}
