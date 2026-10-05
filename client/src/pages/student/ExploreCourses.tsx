import type { Course } from '../../types';
import { CourseCard } from '../../components/course/CourseCard';
import { CourseFilters } from '../../components/course/CourseFilters';

type ExploreCoursesProps = {
  courses: Course[];
  search: string;
  category: string;
  level: string;
  onSearch: (value: string) => void;
  onCategory: (value: string) => void;
  onLevel: (value: string) => void;
  onEnroll: (courseId: string) => void;
  onOpenLesson: (course: Course) => void;
};

export function ExploreCourses(props: ExploreCoursesProps) {
  return (
    <section className="space-y-5">
      <CourseFilters {...props} />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {props.courses.map((course) => (
          <CourseCard key={course.id} course={course} onEnroll={() => props.onEnroll(course.id)} onOpen={() => props.onOpenLesson(course)} />
        ))}
      </div>
    </section>
  );
}
