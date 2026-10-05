import { Eye, LibraryBig, ShieldCheck, Users } from 'lucide-react';
import type { Course, UserProfile } from '../../types';
import { AnalyticsCharts } from '../../components/course/AnalyticsCharts';
import { KpiGrid } from '../../components/common/KpiGrid';

type AdminDashboardProps = {
  users: UserProfile[];
  courses: Course[];
};

export function AdminDashboard({ users, courses }: AdminDashboardProps) {
  return (
    <section className="space-y-6">
      <KpiGrid
        cards={[
          ['Total Users', users.length, Users, 'bg-brand-50 text-brand-600'],
          ['Total Courses', courses.length, LibraryBig, 'bg-emerald-50 text-emerald-600'],
          ['Published', courses.filter((course) => course.status === 'published').length, Eye, 'bg-amber-50 text-amber-600'],
          ['System Health', '99.9%', ShieldCheck, 'bg-slate-100 text-slate-700']
        ]}
      />
      <AnalyticsCharts courses={courses} compact />
    </section>
  );
}
