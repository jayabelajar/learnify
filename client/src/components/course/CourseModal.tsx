import { X } from 'lucide-react';
import { Input, LabeledSelect } from '../common/FormControls';

type CourseModalProps = {
  editing: unknown;
  form: any;
  onChange: (form: any) => void;
  onClose: () => void;
  onSave: (event: React.FormEvent) => void;
};

export function CourseModal({ editing, form, onChange, onClose, onSave }: CourseModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4">
      <form className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl" onSubmit={onSave}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{editing ? 'Edit Course' : 'Create Course'}</h2>
          <button type="button" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4">
          <Input label="Title" value={form.title} onChange={(value) => onChange({ ...form, title: value })} required />
          <Input label="Short Description" value={form.shortDescription || ''} onChange={(value) => onChange({ ...form, shortDescription: value })} />
          <label className="text-sm font-semibold">
            Description
            <textarea
              className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand-500"
              value={form.description}
              onChange={(event) => onChange({ ...form, description: event.target.value })}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            <LabeledSelect label="Category" value={form.category} values={['Web Dev', 'Backend', 'Data Science', 'Design']} onChange={(value) => onChange({ ...form, category: value })} />
            <LabeledSelect label="Level" value={form.level} values={['Beginner', 'Intermediate', 'Advanced']} onChange={(value) => onChange({ ...form, level: value })} />
            <LabeledSelect label="Status" value={form.status} values={['draft', 'published']} onChange={(value) => onChange({ ...form, status: value })} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={onClose}>
            Cancel
          </button>
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Save Course</button>
        </div>
      </form>
    </div>
  );
}
