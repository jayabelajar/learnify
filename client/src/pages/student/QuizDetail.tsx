import { Panel } from '../../components/common/Panel';

export function QuizDetail({ quiz, results, onBack }: { quiz: any; results: any[]; onBack: () => void }) {
  return (
    <section className="space-y-6">
      <button className="text-sm font-semibold text-brand-600 hover:text-brand-700" onClick={onBack}>Back to quizzes</button>
      <Panel title={quiz.title}>
        <div className="grid gap-4 md:grid-cols-4">
          <Info label="Course" value={quiz.courseTitle} />
          <Info label="Questions" value={quiz.questions} />
          <Info label="Passing Score" value={quiz.passingScore} />
          <Info label="Status" value={quiz.status} />
        </div>
      </Panel>
      <Panel title="Attempt History">
        <div className="space-y-3">
          {results.map((result) => (
            <div key={result.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-4">
              <div>
                <p className="font-semibold">{result.quizTitle}</p>
                <p className="text-sm text-slate-500">{result.courseTitle} - {result.date}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${result.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{result.score}%</span>
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
