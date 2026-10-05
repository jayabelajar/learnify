type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
};

export function Input({ label, value, onChange, required = false, type = 'text' }: InputProps) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <input
        type={type}
        required={required}
        className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand-500"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

type SelectProps = {
  value: string;
  values: string[];
  onChange: (value: string) => void;
};

export function Select({ value, values, onChange }: SelectProps) {
  return (
    <select
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-brand-500"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {values.map((item) => (
        <option key={item}>{item}</option>
      ))}
    </select>
  );
}

type LabeledSelectProps = SelectProps & {
  label: string;
};

export function LabeledSelect({ label, value, values, onChange }: LabeledSelectProps) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <select
        className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand-500"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {values.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}
