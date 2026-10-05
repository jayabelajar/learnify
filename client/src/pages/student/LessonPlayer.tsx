import { CheckCircle2, ChevronLeft, ClipboardCheck, FileQuestion, FileText, PlayCircle, UploadCloud } from 'lucide-react';
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
  const TypeIcon = activeLesson?.type === 'quiz' ? FileQuestion : activeLesson?.type === 'submission' ? UploadCloud : activeLesson?.type === 'video' ? PlayCircle : FileText;

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Panel>
        <button className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-600" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" /> My Learning
        </button>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
          {activeLesson?.type === 'video' ? (
            <iframe className="aspect-video w-full" src={activeLesson.videoUrl || 'https://www.youtube.com/embed/Tn6-PIqc4UM'} title={activeLesson.title} allowFullScreen />
          ) : (
            <div className="flex aspect-video items-center justify-center text-white">
              <TypeIcon className="h-16 w-16" />
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">{activeLesson?.type} lesson</p>
            <h2 className="mt-1 text-2xl font-bold">{activeLesson?.title}</h2>
            <p className="mt-3 max-w-2xl text-slate-600">{activeLesson?.description}</p>
          </div>
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white" onClick={onComplete}>
            Mark Complete
          </button>
        </div>

        {activeLesson?.type === 'article' && <article className="prose prose-slate mt-6 max-w-none rounded-xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">{activeLesson.content}</article>}

        {activeLesson?.type === 'quiz' && activeLesson.quiz && (
          <div className="mt-6 space-y-4">
            {activeLesson.quiz.questions.map((question, index) => (
              <div key={question.id} className="rounded-xl border border-slate-200 p-4">
                <p className="font-semibold">{index + 1}. {question.question}</p>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {question.options.map((option) => (
                    <button key={option} className="rounded-lg border border-slate-200 px-3 py-2 text-left text-sm hover:border-brand-300 hover:bg-brand-50">{option}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeLesson?.type === 'submission' && (
          <div className="mt-6 rounded-xl border border-dashed border-brand-200 bg-brand-50 p-5">
            <div className="flex items-center gap-2 font-bold text-brand-800">
              <ClipboardCheck className="h-5 w-5" /> Submission Task
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-700">{activeLesson.submissionInstructions}</p>
            <input className="mt-4 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm" placeholder="Paste repository, drive, or deployment URL..." />
          </div>
        )}
      </Panel>

      <Panel>
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
                    <span className="text-xs capitalize text-slate-400">{lesson.type}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}
