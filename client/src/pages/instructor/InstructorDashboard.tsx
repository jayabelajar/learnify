import { Eye, FolderKanban, TrendingUp, Users } from 'lucide-react';
import type { Course } from '../../types';
import { AnalyticsCharts } from '../../components/course/AnalyticsCharts';
import { KpiGrid } from '../../components/common/KpiGrid';

type InstructorDashboardProps = {
  courses: Course[];
};

export function InstructorDashboard({ courses }: InstructorDashboardProps) {
  const published = courses.filter((course) => course.status === 'published').length;
  const totalStudents = courses.reduce((sum, course) => sum + course.studentsCount, 0);
  const avgCompletion = Math.round(courses.reduce((sum, course) => sum + course.completionRate, 0) / courses.length);

  return (
    <section className="space-y-6">
      <KpiGrid
        cards={[
          ['Total Courses', courses.length, FolderKanban, 'bg-brand-50 text-brand-600'],
          ['Published Courses', published, Eye, 'bg-emerald-50 text-emerald-600'],
          ['Total Students', totalStudents, Users, 'bg-amber-50 text-amber-600'],
          ['Avg Completion', `${avgCompletion}%`, TrendingUp, 'bg-slate-100 text-slate-700']
        ]}
      />
      <AnalyticsCharts courses={courses} compact />
    </section>
  );
}
