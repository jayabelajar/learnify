import { DataTable } from '../../components/common/DataTable';

type QuizResultsProps = {
  results: any[];
};

export function QuizResults({ results }: QuizResultsProps) {
  return (
    <DataTable
      title="Quiz Results"
      headers={['Quiz', 'Course', 'Score', 'Status', 'Date']}
      rows={results.map((result) => [result.quizTitle, result.courseTitle, `${result.score}%`, result.passed ? 'Pass' : 'Fail', result.date])}
    />
  );
}
