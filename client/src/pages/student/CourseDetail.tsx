import { Award, BookOpen, CheckCircle2, Clock, Users } from 'lucide-react';
import type { Course } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Panel } from '../../components/common/Panel';
import { Progress } from '../../components/common/Progress';

type CourseDetailProps = {
  course: Course;
  onEnroll: (courseId: string) => void;
  onStart: (course: Course) => void;
  onBack: () => void;
};

export function CourseDetail({ course, onEnroll, onStart, onBack }: CourseDetailProps) {
  const lessons = course.modules.flatMap((module) => module.lessons);
  const totalDuration = lessons.reduce((sum, lesson) => sum + lesson.duration, 0);

  return (
    <section className="space-y-6">
      <button className="text-sm font-semibold text-brand-600 hover:text-brand-700" onClick={onBack}>Back to courses</button>
      <Panel>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="indigo">{course.category}</Badge>
              <Badge tone={course.status === 'published' ? 'green' : 'gray'}>{course.level}</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-slate-900">{course.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{course.description}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              {[
                [BookOpen, `${course.modules.length} modules`],
                [Clock, `${totalDuration} min`],
                [Users, `${course.studentsCount} students`],
                [Award, `${course.rating} rating`]
              ].map(([Icon, label]: any) => (
                <div key={label} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm font-semibold text-slate-700">
                  <Icon className="mb-2 h-4 w-4 text-brand-600" />
                  {label}
                </div>
              ))}
            </div>
            {course.isEnrolled && <div className="mt-5"><Progress value={course.progress} /></div>}
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700" onClick={() => (course.isEnrolled ? onStart(course) : onEnroll(course.id))}>
                {course.isEnrolled ? 'Continue Learning' : 'Enroll Course'}
              </button>
              {course.isEnrolled && (
                <button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => onStart(course)}>
                  Open Lesson Player
                </button>
              )}
            </div>
          </div>
          <img className="h-full min-h-72 rounded-xl object-cover" src={course.thumbnail} alt={course.title} />
        </div>
      </Panel>
      <Panel title="Curriculum">
        <div className="space-y-4">
          {course.modules.map((module, index) => (
            <div key={module.id} className="rounded-xl border border-slate-100 p-4">
              <p className="font-bold">Module {index + 1}: {module.title}</p>
              <div className="mt-3 space-y-2">
                {module.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                    <span className="flex items-center gap-2">
                      {lesson.completed && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                      {lesson.title}
                    </span>
                    <span className="text-xs font-semibold uppercase text-slate-400">{lesson.type}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}
