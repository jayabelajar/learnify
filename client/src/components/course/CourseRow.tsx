import type { Course } from '../../types';
import { Progress } from '../common/Progress';

type CourseRowProps = {
  course: Course;
  onOpen: () => void;
};

export function CourseRow({ course, onOpen }: CourseRowProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center">
      <img className="h-28 w-full rounded-lg object-cover sm:h-16 sm:w-24" src={course.thumbnail} alt={course.title} />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{course.title}</p>
        <p className="text-sm text-slate-500">{course.instructor}</p>
        <Progress value={course.progress} />
      </div>
      <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" onClick={onOpen}>
        Continue
      </button>
    </div>
  );
}
