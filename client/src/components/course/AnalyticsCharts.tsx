import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import type { Course } from '../../types';
import { categoryBreakdown } from '../../utils/app';
import { Panel } from '../common/Panel';

const categoryColors = ['#4F46E5', '#10B981', '#F59E0B', '#64748B'];

type AnalyticsChartsProps = {
  courses: Course[];
  compact?: boolean;
};

export function AnalyticsCharts({ courses, compact = false }: AnalyticsChartsProps) {
  const chartData = courses.map((course) => ({ name: course.title.split(' ')[0], students: course.studentsCount, completion: course.completionRate }));

  return (
    <section className="grid gap-6 xl:grid-cols-3">
      <Panel className="xl:col-span-2" title="Enrollment and Completion Trend">
        <div className={compact ? 'h-72' : 'h-96'}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="studentsFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="students" stroke="#4F46E5" fill="url(#studentsFill)" strokeWidth={3} />
              <Line type="monotone" dataKey="completion" stroke="#10B981" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <Panel title="Course Mix">
        <div className={compact ? 'h-72' : 'h-96'}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryBreakdown(courses)} dataKey="value" nameKey="name" innerRadius={55} outerRadius={100}>
                {categoryBreakdown(courses).map((entry, index) => (
                  <Cell key={entry.name} fill={categoryColors[index % categoryColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      {!compact && (
        <Panel className="xl:col-span-3" title="Course Performance">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completion" fill="#10B981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="students" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      )}
    </section>
  );
}
