import { Award, BookOpen, CheckCircle2, PlayCircle } from 'lucide-react';
import type { Course } from '../../types';
import { CourseRow } from '../../components/course/CourseRow';
import { KpiGrid } from '../../components/common/KpiGrid';
import { Panel } from '../../components/common/Panel';

type StudentDashboardProps = {
  kpis: {
    enrolled: number;
    completed: number;
    lessonsDone: number;
    avgScore: number;
  };
  courses: Course[];
  quizResults: any[];
  onExplore: () => void;
  onOpenLesson: (course: Course) => void;
};

export function StudentDashboard({ kpis, courses, quizResults, onExplore, onOpenLesson }: StudentDashboardProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-brand-600 to-slate-800 p-6 text-white shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Continue your learning path</h2>
          <p className="mt-1 text-sm text-indigo-100">Track enrolled courses, completed lessons, and recent quiz performance.</p>
        </div>
        <button className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 shadow-sm hover:bg-brand-50" onClick={onExplore}>
          Browse Courses
        </button>
      </div>
      <KpiGrid
        cards={[
          ['Enrolled Courses', kpis.enrolled, BookOpen, 'bg-brand-50 text-brand-600'],
          ['Completed Courses', kpis.completed, CheckCircle2, 'bg-emerald-50 text-emerald-600'],
          ['Lessons Completed', kpis.lessonsDone, PlayCircle, 'bg-amber-50 text-amber-600'],
          ['Average Quiz Score', `${kpis.avgScore}%`, Award, 'bg-slate-100 text-slate-700']
        ]}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="Continue Learning">
          <div className="space-y-4">
            {courses.slice(0, 3).map((course) => (
              <CourseRow key={course.id} course={course} onOpen={() => onOpenLesson(course)} />
            ))}
          </div>
        </Panel>
        <Panel title="Recent Quiz Results">
          <div className="space-y-3">
            {quizResults.slice(0, 4).map((result) => (
              <ResultRow key={result.id} result={result} />
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}

function ResultRow({ result }: { result: any }) {
  return (
    <div className="rounded-lg border border-slate-100 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{result.quizTitle}</p>
          <p className="text-xs text-slate-500">{result.courseTitle}</p>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-bold ${result.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{result.score}%</span>
      </div>
      <p className="mt-2 text-xs text-slate-400">{result.date}</p>
    </div>
  );
}
