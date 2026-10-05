import { CheckCircle2, ChevronLeft, FileText, PlayCircle } from 'lucide-react';
import type { Course, Lesson } from '../../types';
import { Panel } from '../../components/common/Panel';
import { Progress } from '../../components/common/Progress';

type LessonPlayerProps = {
  course: Course;
  activeLesson: Lesson;
  onSelectLesson: (lesson: Lesson) => void;
  onComplete: () => void;
  onBack: () => void;
};

export function LessonPlayer({ course, activeLesson, onSelectLesson, onComplete, onBack }: LessonPlayerProps) {
  return (
    <section className="grid gap-6 xl:grid-cols-[340px_1fr]">
      <Panel>
        <button className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" /> My Learning
        </button>
        <h2 className="font-bold">{course.title}</h2>
        <Progress value={course.progress} />
        <div className="mt-5 space-y-4">
          {course.modules.map((module) => (
            <div key={module.id}>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">{module.title}</p>
              <div className="space-y-2">
                {module.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm ${activeLesson?.id === lesson.id ? 'border-brand-200 bg-brand-50 text-brand-700' : 'border-slate-100 hover:bg-slate-50'}`}
                    onClick={() => onSelectLesson(lesson)}
                  >
                    {lesson.completed ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <PlayCircle className="h-4 w-4 text-slate-400" />}
                    <span className="flex-1">{lesson.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel>
        <div className="mb-5 flex h-72 items-center justify-center rounded-xl bg-slate-900 text-white">
          {activeLesson?.type === 'pdf' ? <FileText className="h-16 w-16" /> : <PlayCircle className="h-16 w-16" />}
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">{activeLesson?.type} lesson</p>
            <h2 className="mt-1 text-2xl font-bold">{activeLesson?.title}</h2>
            <p className="mt-3 max-w-2xl text-slate-600">{activeLesson?.description}</p>
          </div>
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white" onClick={onComplete}>
            Mark Complete
          </button>
        </div>
      </Panel>
    </section>
  );
}
