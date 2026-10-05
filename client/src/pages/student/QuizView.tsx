import { ChevronRight } from 'lucide-react';
import type { Quiz } from '../../types';
import { Panel } from '../../components/common/Panel';

type QuizViewProps = {
  quiz: Quiz & { courseTitle: string };
  answers: Record<string, number>;
  index: number;
  onAnswer: (questionId: string, answer: number) => void;
  onIndex: (index: number) => void;
  onSubmit: () => void;
};

export function QuizView({ quiz, answers, index, onAnswer, onIndex, onSubmit }: QuizViewProps) {
  const question = quiz.questions[index];
  const isLast = index === quiz.questions.length - 1;

  return (
    <Panel>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-600">
            Question {index + 1} of {quiz.questions.length}
          </p>
          <h2 className="mt-1 text-2xl font-bold">{quiz.title}</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Passing {quiz.passingScore}%</span>
      </div>
      <h3 className="text-lg font-semibold">{question.question}</h3>
      <div className="mt-5 grid gap-3">
        {question.options.map((option, optionIndex) => (
          <button
            key={option}
            className={`rounded-xl border px-4 py-3 text-left text-sm font-medium ${answers[question.id] === optionIndex ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 hover:bg-slate-50'}`}
            onClick={() => onAnswer(question.id, optionIndex)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold disabled:opacity-40" disabled={index === 0} onClick={() => onIndex(index - 1)}>
          Previous
        </button>
        {isLast ? (
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white" onClick={onSubmit}>
            Submit Quiz
          </button>
        ) : (
          <button className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => onIndex(index + 1)}>
            Next <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </Panel>
  );
}
