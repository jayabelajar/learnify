import { Paperclip } from 'lucide-react';
import { Panel } from '../../components/common/Panel';

type AssignmentDetailProps = {
  assignment: any;
  submissions: any[];
  onSubmit: (payload: any) => void;
  onBack: () => void;
};

export function AssignmentDetail({ assignment, submissions, onSubmit, onBack }: AssignmentDetailProps) {
  return (
    <section className="space-y-6">
      <button className="text-sm font-semibold text-brand-600 hover:text-brand-700" onClick={onBack}>Back to assignments</button>
      <Panel title={assignment.title}>
        <div className="grid gap-4 md:grid-cols-4">
          <Info label="Course" value={assignment.courseTitle} />
          <Info label="Due Date" value={assignment.dueDate} />
          <Info label="Points" value={assignment.points} />
          <Info label="Status" value={assignment.status} />
        </div>
        <form
          className="mt-6 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            onSubmit({ content: form.get('content'), file: form.get('file') });
            event.currentTarget.reset();
          }}
        >
          <textarea name="content" className="min-h-28 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-50" placeholder="Submission notes or URL" />
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            <Paperclip className="h-4 w-4" />
            Attach file
            <input name="file" type="file" className="hidden" />
          </label>
          <button className="w-fit rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Submit Assignment</button>
        </form>
      </Panel>
      <Panel title="Submission History">
        <div className="space-y-3">
          {submissions.map((submission) => (
            <div key={submission.id} className="rounded-lg border border-slate-100 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{submission.assignmentTitle}</p>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{submission.status}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">Grade: {submission.grade}</p>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}
