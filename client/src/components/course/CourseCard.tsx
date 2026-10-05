import type { Course } from '../../types';
import { Progress } from '../common/Progress';

type CourseCardProps = {
  course: Course;
  onEnroll: () => void;
  onOpen: () => void;
};

export function CourseCard({ course, onEnroll, onOpen }: CourseCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <img className="h-40 w-full object-cover" src={course.thumbnail} alt={course.title} />
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{course.category}</span>
          <span className="text-xs font-medium text-slate-500">{course.level}</span>
        </div>
        <div>
          <h3 className="font-bold">{course.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-500">{course.description}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{course.instructor}</span>
          <span>{course.studentsCount} students</span>
        </div>
        {course.isEnrolled && <Progress value={course.progress} />}
        <div className="grid grid-cols-2 gap-2">
          <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={onEnroll}>
            {course.isEnrolled ? 'Enrolled' : 'Enroll'}
          </button>
          <button className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700" onClick={onOpen}>
            View
          </button>
        </div>
      </div>
    </article>
  );
}
