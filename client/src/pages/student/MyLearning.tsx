import type { Course, Quiz } from '../../types';
import { CourseFilters } from '../../components/course/CourseFilters';
import { Badge } from '../../components/common/Badge';
import { Panel } from '../../components/common/Panel';
import { Progress } from '../../components/common/Progress';

type MyLearningProps = {
  courses: Course[];
  search: string;
  category: string;
  level: string;
  completion: string;
  onSearch: (value: string) => void;
  onCategory: (value: string) => void;
  onLevel: (value: string) => void;
  onCompletion: (value: string) => void;
  onOpenLesson: (course: Course) => void;
  onStartQuiz: (quiz: Quiz, course: Course) => void;
};

export function MyLearning(props: MyLearningProps) {
  return (
    <section className="space-y-5">
      <CourseFilters {...props} showCompletion />
      <div className="grid gap-5 lg:grid-cols-2">
        {props.courses.map((course) => (
          <Panel key={course.id}>
            <div className="flex flex-col gap-4 sm:flex-row">
              <img className="h-32 rounded-lg object-cover sm:w-40" src={course.thumbnail} alt={course.title} />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold">{course.title}</p>
                  <Badge tone={course.progress === 100 ? 'green' : 'gray'}>
                    {course.progress === 100 ? 'Completed' : course.progress > 0 ? 'In Progress' : 'Not Started'}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">{course.description}</p>
                <Progress value={course.progress} />
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => props.onOpenLesson(course)}>
                    Open Course
                  </button>
                  {course.modules
                    .flatMap((module) => (module.quiz ? [module.quiz] : []))
                    .map((quiz) => (
                      <button key={quiz.id} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700" onClick={() => props.onStartQuiz(quiz, course)}>
                        Start Quiz
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </section>
  );
}
