import type { Course } from '../../types';
import { DataTable } from '../../components/common/DataTable';

type AdminCoursesProps = {
  courses: Course[];
};

export function AdminCourses({ courses }: AdminCoursesProps) {
  return (
    <DataTable
      title="Course Governance"
      headers={['Course', 'Instructor', 'Status', 'Students', 'Completion']}
      rows={courses.map((course) => [course.title, course.instructor, course.status, course.studentsCount, `${course.completionRate}%`])}
    />
  );
}
