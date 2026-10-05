import { Plus, Trash2 } from 'lucide-react';
import type { Course, CourseModule } from '../../types';
import { IconButton } from '../../components/common/IconButton';
import { Panel } from '../../components/common/Panel';

type ContentBuilderProps = {
  courses: Course[];
  selectedCourse: Course;
  onSelectCourse: (courseId: string) => void;
  onAddModule: (courseId: string) => void;
  onAddLesson: (courseId: string, moduleId: string) => void;
  onDeleteLesson: (courseId: string, moduleId: string, lessonId: string) => void;
};

export function ContentBuilder({ courses, selectedCourse, onSelectCourse, onAddModule, onAddLesson, onDeleteLesson }: ContentBuilderProps) {
  return (
    <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <Panel title="Courses">
        <div className="space-y-2">
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
            <p className="mt-1 text-sm text-slate-500">Manage modules, lessons, and quiz blocks for this course.</p>
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
                {module.lessons.map((lesson, lessonIndex) => (
                  <div key={lesson.id} className="flex flex-col gap-3 rounded-lg bg-slate-50 p-3 md:flex-row md:items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand-600">{lessonIndex + 1}</div>
                    <div className="flex-1">
                      <p className="font-semibold">{lesson.title}</p>
                      <p className="text-xs text-slate-500">
                        {lesson.type} - {lesson.duration} min
                      </p>
                    </div>
                    <IconButton label="Delete lesson" icon={Trash2} danger onClick={() => onDeleteLesson(selectedCourse.id, module.id, lesson.id)} />
                  </div>
                ))}
                {module.quiz && <div className="rounded-lg border border-dashed border-brand-200 bg-brand-50 p-3 text-sm font-semibold text-brand-700">Quiz: {module.quiz.title}</div>}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}
