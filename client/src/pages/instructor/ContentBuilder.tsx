import { FileQuestion, FileText, PlayCircle, Plus, Trash2, UploadCloud } from 'lucide-react';
import type { Course, CourseModule, Lesson } from '../../types';
import { IconButton } from '../../components/common/IconButton';
import { Panel } from '../../components/common/Panel';

const lessonTypes: Lesson['type'][] = ['article', 'video', 'quiz', 'submission'];

type ContentBuilderProps = {
  courses: Course[];
  selectedCourse: Course;
  onSelectCourse: (courseId: string) => void;
  onAddModule: (courseId: string) => void;
  onAddLesson: (courseId: string, moduleId: string) => void;
  onUpdateLesson: (courseId: string, moduleId: string, lessonId: string, patch: Partial<Lesson>) => void;
  onDeleteLesson: (courseId: string, moduleId: string, lessonId: string) => void;
};

export function ContentBuilder({ courses, selectedCourse, onSelectCourse, onAddModule, onAddLesson, onUpdateLesson, onDeleteLesson }: ContentBuilderProps) {
  return (
    <section className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
      <Panel title="Courses">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
          {courses.map((course) => (
            <button key={course.id} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${course.id === selectedCourse.id ? 'bg-brand-50 font-semibold text-brand-700' : 'hover:bg-slate-50'}`} onClick={() => onSelectCourse(course.id)}>
              {course.title}
            </button>
          ))}
        </div>
      </Panel>
      <Panel>
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Course Builder</p>
            <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
            <p className="mt-1 text-sm text-slate-500">Manage article, video, quiz, and submission content for this course.</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => onAddModule(selectedCourse.id)}>
            <Plus className="h-4 w-4" /> Module
          </button>
        </div>
        <div className="space-y-4">
          {selectedCourse.modules.map((module: CourseModule, moduleIndex: number) => (
            <div key={module.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Module {moduleIndex + 1}</p>
                  <h3 className="font-bold">{module.title}</h3>
                </div>
                <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold" onClick={() => onAddLesson(selectedCourse.id, module.id)}>
                  <Plus className="h-4 w-4" /> Lesson
                </button>
              </div>
              <div className="mt-4 space-y-2">
                {module.lessons.map((lesson, lessonIndex) => {
                  const TypeIcon = lesson.type === 'quiz' ? FileQuestion : lesson.type === 'submission' ? UploadCloud : lesson.type === 'video' ? PlayCircle : FileText;
                  return (
                  <div key={lesson.id} className="grid gap-3 rounded-lg bg-slate-50 p-3 lg:grid-cols-[44px_minmax(0,1fr)_auto] lg:items-start">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brand-600">
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1.4fr)_160px_110px]">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Lesson {lessonIndex + 1}
                        <input className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm font-semibold normal-case tracking-normal text-slate-800 outline-none focus:border-brand-500" value={lesson.title} onChange={(event) => onUpdateLesson(selectedCourse.id, module.id, lesson.id, { title: event.target.value })} />
                      </label>
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Type
                        <select className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm normal-case tracking-normal text-slate-700 outline-none focus:border-brand-500" value={lesson.type} onChange={(event) => onUpdateLesson(selectedCourse.id, module.id, lesson.id, { type: event.target.value as Lesson['type'] })}>
                          {lessonTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                        </select>
                      </label>
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Minutes
                        <input type="number" min={1} className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm normal-case tracking-normal text-slate-700 outline-none focus:border-brand-500" value={lesson.duration} onChange={(event) => onUpdateLesson(selectedCourse.id, module.id, lesson.id, { duration: Number(event.target.value) })} />
                      </label>
                      <label className="md:col-span-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Description
                        <input className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm normal-case tracking-normal text-slate-700 outline-none focus:border-brand-500" value={lesson.description} onChange={(event) => onUpdateLesson(selectedCourse.id, module.id, lesson.id, { description: event.target.value })} />
                      </label>
                      {lesson.type === 'video' && (
                        <label className="md:col-span-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          YouTube Embed URL
                          <input className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm normal-case tracking-normal text-slate-700 outline-none focus:border-brand-500" value={lesson.videoUrl || ''} onChange={(event) => onUpdateLesson(selectedCourse.id, module.id, lesson.id, { videoUrl: event.target.value })} />
                        </label>
                      )}
                      {lesson.type === 'article' && (
                        <label className="md:col-span-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Article Content
                          <textarea className="mt-1 min-h-24 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm normal-case tracking-normal text-slate-700 outline-none focus:border-brand-500" value={lesson.content || ''} onChange={(event) => onUpdateLesson(selectedCourse.id, module.id, lesson.id, { content: event.target.value })} />
                        </label>
                      )}
                      {lesson.type === 'submission' && (
                        <label className="md:col-span-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Submission Instructions
                          <textarea className="mt-1 min-h-24 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm normal-case tracking-normal text-slate-700 outline-none focus:border-brand-500" value={lesson.submissionInstructions || ''} onChange={(event) => onUpdateLesson(selectedCourse.id, module.id, lesson.id, { submissionInstructions: event.target.value })} />
                        </label>
                      )}
                      {lesson.type === 'quiz' && (
                        <div className="md:col-span-3 rounded-lg border border-dashed border-brand-200 bg-white p-3 text-sm text-slate-600">
                          Quiz questions are stored on this lesson item. Use the seeded quiz as the reference structure for DB payloads.
                        </div>
                      )}
                    </div>
                    <IconButton label="Delete lesson" icon={Trash2} danger onClick={() => onDeleteLesson(selectedCourse.id, module.id, lesson.id)} />
                  </div>
                )})}
                {module.quiz && <div className="rounded-lg border border-dashed border-brand-200 bg-brand-50 p-3 text-sm font-semibold text-brand-700">Quiz: {module.quiz.title}</div>}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}
