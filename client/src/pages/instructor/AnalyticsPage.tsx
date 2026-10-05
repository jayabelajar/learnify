import type { Course } from '../../types';
import { AnalyticsCharts } from '../../components/course/AnalyticsCharts';

type AnalyticsPageProps = {
  courses: Course[];
};

export function AnalyticsPage({ courses }: AnalyticsPageProps) {
  return <AnalyticsCharts courses={courses} />;
}
