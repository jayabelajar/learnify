import { seedStudents } from '../../data/demoData';
import { DataTable } from '../../components/common/DataTable';

export function StudentsTable() {
  return (
    <DataTable
      title="Enrolled Students"
      headers={['Student', 'Course', 'Enrollment', 'Progress', 'Quiz Avg']}
      rows={seedStudents.map((student) => [student.name, student.course, student.date, `${student.progress}%`, `${student.quizAvg}%`])}
    />
  );
}
