import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Edit3,
  Eye,
  FileText,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  PlayCircle,
  Plus,
  Search,
  Settings,
  Trash2,
  TrendingUp,
  User,
  Users,
  X
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { demoUser, seedCourses, seedQuizResults, seedStudents } from './data/demoData';

const studentNav = [
  { id: 'student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'explore', label: 'Explore Courses', icon: Compass },
  { id: 'my-learning', label: 'My Learning', icon: BookOpen },
  { id: 'quiz-results', label: 'Quiz Results', icon: Award },
  { id: 'profile', label: 'Profile', icon: User }
];

const instructorNav = [
  { id: 'instructor-dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'course-mgmt', label: 'Courses', icon: FolderKanban },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'profile', label: 'Profile', icon: User }
];

const categoryColors = ['#4F46E5', '#10B981', '#F59E0B', '#64748B'];

function App() {
  const [role, setRole] = useState('student');
  const [activeTab, setActiveTab] = useState('student-dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [courses, setCourses] = useState(seedCourses);
  const [quizResults, setQuizResults] = useState(seedQuizResults);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [courseSearch, setCourseSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(seedCourses[0]);
  const [activeLesson, setActiveLesson] = useState(seedCourses[0].modules[0].lessons[0]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState(emptyCourse());

  const enrolledCourses = courses.filter((course) => course.isEnrolled);
  const allLessons = courses.flatMap((course) => course.modules.flatMap((module) => module.lessons));
  const completedLessons = allLessons.filter((lesson) => lesson.completed).length;
  const studentKpis = {
    enrolled: enrolledCourses.length,
    completed: enrolledCourses.filter((course) => course.progress === 100).length,
    lessonsDone: completedLessons,
    avgScore: Math.round(quizResults.reduce((sum, item) => sum + item.score, 0) / quizResults.length)
  };

  const visibleCourses = useMemo(() => {
    return courses.filter((course) => {
      const published = course.status === 'published';
      const matchesSearch = `${course.title} ${course.instructor}`.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || course.category === category;
      const matchesLevel = level === 'All' || course.level === level;
      return published && matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, search, category, level]);

  const instructorCourses = courses.filter((course) => course.title.toLowerCase().includes(courseSearch.toLowerCase()));
  const pageTitle = activeTab.replaceAll('-', ' ');

  function switchRole(nextRole) {
    setRole(nextRole);
    setActiveTab(nextRole === 'student' ? 'student-dashboard' : 'instructor-dashboard');
    setMobileOpen(false);
  }

  function openLesson(course, lesson = null) {
    const firstLesson = lesson || course.modules.flatMap((module) => module.lessons)[0];
    setSelectedCourse(course);
    setActiveLesson(firstLesson);
    setActiveTab('lesson-player');
  }

  function toggleEnrollment(courseId) {
    setCourses((items) =>
      items.map((course) =>
        course.id === courseId
          ? { ...course, isEnrolled: !course.isEnrolled, progress: course.isEnrolled ? course.progress : 0 }
          : course
      )
    );
  }

  function markLessonComplete() {
    if (!activeLesson || !selectedCourse) return;
    setCourses((items) =>
      items.map((course) => {
        if (course.id !== selectedCourse.id) return course;
        const modules = course.modules.map((module) => ({
          ...module,
          lessons: module.lessons.map((lesson) =>
            lesson.id === activeLesson.id ? { ...lesson, completed: true } : lesson
          )
        }));
        const lessons = modules.flatMap((module) => module.lessons);
        const progress = lessons.length
          ? Math.round((lessons.filter((lesson) => lesson.completed).length / lessons.length) * 100)
          : 0;
        const updated = { ...course, modules, progress };
        setSelectedCourse(updated);
        setActiveLesson({ ...activeLesson, completed: true });
        return updated;
      })
    );
  }

  function saveCourse(event) {
    event.preventDefault();
    if (editingCourse) {
      setCourses((items) => items.map((course) => (course.id === editingCourse.id ? { ...course, ...courseForm } : course)));
    } else {
      setCourses((items) => [
        {
          ...courseForm,
          id: crypto.randomUUID(),
          instructor: demoUser.name,
          rating: 5,
          studentsCount: 0,
          completionRate: 0,
          progress: 0,
          isEnrolled: false,
          thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop&q=80',
          modules: []
        },
        ...items
      ]);
    }
    setShowCourseModal(false);
    setEditingCourse(null);
    setCourseForm(emptyCourse());
  }

  function startQuiz(quiz, course) {
    setActiveQuiz({ ...quiz, courseTitle: course.title });
    setSelectedCourse(course);
    setAnswers({});
    setQuestionIndex(0);
    setActiveTab('quiz-view');
  }

  function submitQuiz() {
    const correct = activeQuiz.questions.filter((question) => answers[question.id] === question.correctAnswer).length;
    const score = Math.round((correct / activeQuiz.questions.length) * 100);
    setQuizResults((items) => [
      {
        id: Date.now(),
        quizTitle: activeQuiz.title,
        courseTitle: activeQuiz.courseTitle,
        score,
        passed: score >= activeQuiz.passingScore,
        date: 'Just now'
      },
      ...items
    ]);
    setActiveTab('quiz-results');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <MobileHeader onMenu={() => setMobileOpen(true)} />
      <aside className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform md:static md:translate-x-0`}>
        <SidebarHeader role={role} onClose={() => setMobileOpen(false)} />
        <RoleSwitch role={role} onSwitch={switchRole} />
        <NavList
          items={role === 'student' ? studentNav : instructorNav}
          activeTab={activeTab}
          onNavigate={(tab) => {
            setActiveTab(tab);
            setMobileOpen(false);
          }}
        />
        <ProfileFooter />
      </aside>
      {mobileOpen && <button className="fixed inset-0 z-30 bg-slate-900/30 md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 hidden h-16 items-center justify-between border-b border-slate-200 bg-white px-6 md:flex">
          <h1 className="text-xl font-bold capitalize tracking-tight">{pageTitle}</h1>
          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input className="w-full rounded-lg border border-transparent bg-slate-100 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:bg-white" placeholder="Search anything..." />
            </div>
            <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-600" />
            </button>
            <span className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold capitalize text-brand-700">
              {role} mode
            </span>
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
          {role === 'student' && activeTab === 'student-dashboard' && (
            <StudentDashboard
              kpis={studentKpis}
              courses={enrolledCourses}
              quizResults={quizResults}
              onExplore={() => setActiveTab('explore')}
              onOpenLesson={openLesson}
            />
          )}
          {role === 'student' && activeTab === 'explore' && (
            <ExploreCourses
              courses={visibleCourses}
              search={search}
              category={category}
              level={level}
              onSearch={setSearch}
              onCategory={setCategory}
              onLevel={setLevel}
              onEnroll={toggleEnrollment}
              onOpenLesson={openLesson}
            />
          )}
          {role === 'student' && activeTab === 'my-learning' && (
            <MyLearning courses={enrolledCourses} onOpenLesson={openLesson} onStartQuiz={startQuiz} />
          )}
          {role === 'student' && activeTab === 'lesson-player' && (
            <LessonPlayer
              course={selectedCourse}
              activeLesson={activeLesson}
              onSelectLesson={setActiveLesson}
              onComplete={markLessonComplete}
              onBack={() => setActiveTab('my-learning')}
            />
          )}
          {role === 'student' && activeTab === 'quiz-view' && activeQuiz && (
            <QuizView
              quiz={activeQuiz}
              answers={answers}
              index={questionIndex}
              onAnswer={(questionId, answer) => setAnswers((items) => ({ ...items, [questionId]: answer }))}
              onIndex={setQuestionIndex}
              onSubmit={submitQuiz}
            />
          )}
          {role === 'student' && activeTab === 'quiz-results' && <QuizResults results={quizResults} />}
          {activeTab === 'profile' && <Profile role={role} />}

          {role === 'instructor' && activeTab === 'instructor-dashboard' && <InstructorDashboard courses={courses} />}
          {role === 'instructor' && activeTab === 'course-mgmt' && (
            <CourseManagement
              courses={instructorCourses}
              search={courseSearch}
              onSearch={setCourseSearch}
              onCreate={() => {
                setEditingCourse(null);
                setCourseForm(emptyCourse());
                setShowCourseModal(true);
              }}
              onEdit={(course) => {
                setEditingCourse(course);
                setCourseForm({ ...course });
                setShowCourseModal(true);
              }}
              onDelete={(courseId) => setCourses((items) => items.filter((course) => course.id !== courseId))}
              onTogglePublish={(courseId) =>
                setCourses((items) =>
                  items.map((course) =>
                    course.id === courseId ? { ...course, status: course.status === 'published' ? 'draft' : 'published' } : course
                  )
                )
              }
              onAddModule={(courseId) =>
                setCourses((items) =>
                  items.map((course) =>
                    course.id === courseId
                      ? {
                          ...course,
                          modules: [
                            ...course.modules,
                            { id: crypto.randomUUID(), title: `Module ${course.modules.length + 1}`, lessons: [] }
                          ]
                        }
                      : course
                  )
                )
              }
            />
          )}
          {role === 'instructor' && activeTab === 'students' && <StudentsTable />}
          {role === 'instructor' && activeTab === 'analytics' && <Analytics courses={courses} />}
        </div>
      </main>

      {showCourseModal && role === 'instructor' && activeTab === 'course-mgmt' && (
        <CourseModal
          editing={editingCourse}
          form={courseForm}
          onChange={setCourseForm}
          onClose={() => {
            setShowCourseModal(false);
            setEditingCourse(null);
            setCourseForm(emptyCourse());
          }}
          onSave={saveCourse}
        />
      )}
    </div>
  );
}

function emptyCourse() {
  return {
    title: '',
    shortDescription: '',
    description: '',
    category: 'Web Dev',
    level: 'Beginner',
    status: 'draft'
  };
}

function MobileHeader({ onMenu }) {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
      <Brand />
      <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" onClick={onMenu} aria-label="Open menu">
        <Menu className="h-6 w-6" />
      </button>
    </div>
  );
}

function SidebarHeader({ role, onClose }) {
  return (
    <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
      <Brand subtitle={role === 'student' ? 'Student Portal' : 'Instructor Hub'} />
      <button className="rounded-lg p-1 text-slate-400 md:hidden" onClick={onClose} aria-label="Close menu">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function Brand({ subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-xl font-bold text-white shadow-md shadow-indigo-200">
        L
      </div>
      <div>
        <p className="text-lg font-bold leading-none tracking-tight">Learnify</p>
        {subtitle && <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}

function RoleSwitch({ role, onSwitch }) {
  return (
    <div className="border-b border-slate-100 bg-slate-50/60 p-4">
      <p className="mb-2 text-xs font-medium text-slate-500">Active Mode</p>
      <div className="grid grid-cols-2 rounded-xl bg-slate-200/70 p-1">
        {['student', 'instructor'].map((item) => (
          <button
            key={item}
            className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize transition ${role === item ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => onSwitch(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function NavList({ items, activeTab, onNavigate }) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${active ? 'bg-brand-50 font-semibold text-brand-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            onClick={() => onNavigate(item.id)}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

function ProfileFooter() {
  return (
    <div className="border-t border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <img className="h-9 w-9 rounded-full border border-slate-200 object-cover" src={demoUser.avatar} alt={demoUser.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{demoUser.name}</p>
          <p className="truncate text-xs text-slate-500">{demoUser.email}</p>
        </div>
        <button className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Logout">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function StudentDashboard({ kpis, courses, quizResults, onExplore, onOpenLesson }) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-brand-600 to-slate-800 p-6 text-white shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Welcome back, {demoUser.name}!</h2>
          <p className="mt-1 text-sm text-indigo-100">Progress minggu ini stabil. Lanjutkan lesson yang belum selesai.</p>
        </div>
        <button className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 shadow-sm hover:bg-brand-50" onClick={onExplore}>
          Browse New Courses
        </button>
      </div>
      <KpiGrid
        cards={[
          ['Enrolled Courses', kpis.enrolled, BookOpen, 'bg-brand-50 text-brand-600'],
          ['Completed Courses', kpis.completed, CheckCircle2, 'bg-emerald-50 text-emerald-600'],
          ['Lessons Completed', kpis.lessonsDone, PlayCircle, 'bg-amber-50 text-amber-600'],
          ['Average Quiz Score', `${kpis.avgScore}%`, Award, 'bg-slate-100 text-slate-700']
        ]}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="Continue Learning">
          <div className="space-y-4">
            {courses.slice(0, 3).map((course) => (
              <CourseRow key={course.id} course={course} onOpen={() => onOpenLesson(course)} />
            ))}
          </div>
        </Panel>
        <Panel title="Recent Quiz Results">
          <div className="space-y-3">
            {quizResults.slice(0, 4).map((result) => (
              <ResultRow key={result.id} result={result} />
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}

function KpiGrid({ cards }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(([label, value, Icon, color]) => (
        <div key={label} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className={`rounded-xl p-3 ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Panel({ title, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {title && <h3 className="mb-4 text-base font-bold">{title}</h3>}
      {children}
    </section>
  );
}

function CourseRow({ course, onOpen }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center">
      <img className="h-28 w-full rounded-lg object-cover sm:h-16 sm:w-24" src={course.thumbnail} alt={course.title} />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{course.title}</p>
        <p className="text-sm text-slate-500">{course.instructor}</p>
        <Progress value={course.progress} />
      </div>
      <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" onClick={onOpen}>
        Continue
      </button>
    </div>
  );
}

function Progress({ value }) {
  return (
    <div className="mt-3 flex items-center gap-3">
      <div className="h-2 flex-1 rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-brand-600" style={{ width: `${value}%` }} />
      </div>
      <span className="w-10 text-right text-xs font-semibold text-slate-600">{value}%</span>
    </div>
  );
}

function ResultRow({ result }) {
  return (
    <div className="rounded-lg border border-slate-100 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{result.quizTitle}</p>
          <p className="text-xs text-slate-500">{result.courseTitle}</p>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-bold ${result.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
          {result.score}%
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-400">{result.date}</p>
    </div>
  );
}

function ExploreCourses({ courses, search, category, level, onSearch, onCategory, onLevel, onEnroll, onOpenLesson }) {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(event) => onSearch(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-brand-500" placeholder="Search published courses..." />
        </div>
        <select value={category} onChange={(event) => onCategory(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
          {['All', 'Web Dev', 'Backend', 'Data Science', 'Design'].map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={level} onChange={(event) => onLevel(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} onEnroll={() => onEnroll(course.id)} onOpen={() => onOpenLesson(course)} />
        ))}
      </div>
    </section>
  );
}

function CourseCard({ course, onEnroll, onOpen }) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <img className="h-40 w-full object-cover" src={course.thumbnail} alt={course.title} />
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{course.category}</span>
          <span className="text-xs font-medium text-slate-500">{course.level}</span>
        </div>
        <div>
          <h3 className="font-bold">{course.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-500">{course.description}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{course.instructor}</span>
          <span>{course.studentsCount} students</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={onEnroll}>
            {course.isEnrolled ? 'Enrolled' : 'Enroll'}
          </button>
          <button className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700" onClick={onOpen}>
            View
          </button>
        </div>
      </div>
    </article>
  );
}

function MyLearning({ courses, onOpenLesson, onStartQuiz }) {
  return (
    <section className="grid gap-5 lg:grid-cols-2">
      {courses.map((course) => (
        <Panel key={course.id}>
          <div className="flex flex-col gap-4 sm:flex-row">
            <img className="h-32 rounded-lg object-cover sm:w-40" src={course.thumbnail} alt={course.title} />
            <div className="flex-1">
              <p className="font-bold">{course.title}</p>
              <p className="mt-1 text-sm text-slate-500">{course.description}</p>
              <Progress value={course.progress} />
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => onOpenLesson(course)}>
                  Open Course
                </button>
                {course.modules.flatMap((module) => module.quiz ? [module.quiz] : []).map((quiz) => (
                  <button key={quiz.id} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700" onClick={() => onStartQuiz(quiz, course)}>
                    Start Quiz
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      ))}
    </section>
  );
}

function LessonPlayer({ course, activeLesson, onSelectLesson, onComplete, onBack }) {
  const lessons = course.modules.flatMap((module) => module.lessons);
  return (
    <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <Panel>
        <button className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" /> My Learning
        </button>
        <h2 className="font-bold">{course.title}</h2>
        <Progress value={course.progress} />
        <div className="mt-5 space-y-4">
          {course.modules.map((module) => (
            <div key={module.id}>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">{module.title}</p>
              <div className="space-y-2">
                {module.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm ${activeLesson?.id === lesson.id ? 'border-brand-200 bg-brand-50 text-brand-700' : 'border-slate-100 hover:bg-slate-50'}`}
                    onClick={() => onSelectLesson(lesson)}
                  >
                    {lesson.completed ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <PlayCircle className="h-4 w-4 text-slate-400" />}
                    <span className="flex-1">{lesson.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel>
        <div className="mb-5 flex h-72 items-center justify-center rounded-xl bg-slate-900 text-white">
          {activeLesson?.type === 'pdf' ? <FileText className="h-16 w-16" /> : <PlayCircle className="h-16 w-16" />}
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">{activeLesson?.type} lesson</p>
            <h2 className="mt-1 text-2xl font-bold">{activeLesson?.title}</h2>
            <p className="mt-3 max-w-2xl text-slate-600">{activeLesson?.description}</p>
          </div>
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white" onClick={onComplete}>
            Mark Complete
          </button>
        </div>
      </Panel>
    </section>
  );
}

function QuizView({ quiz, answers, index, onAnswer, onIndex, onSubmit }) {
  const question = quiz.questions[index];
  const isLast = index === quiz.questions.length - 1;
  return (
    <Panel>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-600">Question {index + 1} of {quiz.questions.length}</p>
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
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white" onClick={onSubmit}>Submit Quiz</button>
        ) : (
          <button className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => onIndex(index + 1)}>
            Next <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </Panel>
  );
}

function QuizResults({ results }) {
  return (
    <Panel title="Quiz Results">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-400">
            <tr><th className="py-3">Quiz</th><th>Course</th><th>Score</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {results.map((result) => (
              <tr key={result.id}>
                <td className="py-4 font-semibold">{result.quizTitle}</td>
                <td className="text-slate-500">{result.courseTitle}</td>
                <td className="font-bold">{result.score}%</td>
                <td><span className={`rounded-full px-2 py-1 text-xs font-semibold ${result.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{result.passed ? 'Pass' : 'Fail'}</span></td>
                <td className="text-slate-500">{result.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function InstructorDashboard({ courses }) {
  const published = courses.filter((course) => course.status === 'published').length;
  const totalStudents = courses.reduce((sum, course) => sum + course.studentsCount, 0);
  const avgCompletion = Math.round(courses.reduce((sum, course) => sum + course.completionRate, 0) / courses.length);
  const chartData = courses.map((course) => ({ name: course.title.split(' ')[0], students: course.studentsCount, completion: course.completionRate }));
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
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="Enrollment per Course">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Category Mix">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryBreakdown(courses)} dataKey="value" nameKey="name" outerRadius={100}>
                  {categoryBreakdown(courses).map((entry, index) => <Cell key={entry.name} fill={categoryColors[index % categoryColors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </section>
  );
}

function categoryBreakdown(courses) {
  return Object.entries(courses.reduce((acc, course) => ({ ...acc, [course.category]: (acc[course.category] || 0) + 1 }), {}))
    .map(([name, value]) => ({ name, value }));
}

function CourseManagement({ courses, search, onSearch, onCreate, onEdit, onDelete, onTogglePublish, onAddModule }) {
  return (
    <Panel>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(event) => onSearch(event.target.value)} className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-brand-500" placeholder="Search your courses..." />
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white" onClick={onCreate}>
          <Plus className="h-4 w-4" /> Create Course
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-400">
            <tr><th className="py-3">Course</th><th>Status</th><th>Students</th><th>Lessons</th><th>Completion</th><th>Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <img className="h-12 w-16 rounded-lg object-cover" src={course.thumbnail} alt={course.title} />
                    <div><p className="font-semibold">{course.title}</p><p className="text-xs text-slate-500">{course.category} - {course.level}</p></div>
                  </div>
                </td>
                <td><span className={`rounded-full px-2 py-1 text-xs font-semibold ${course.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{course.status}</span></td>
                <td>{course.studentsCount}</td>
                <td>{course.modules.flatMap((module) => module.lessons).length}</td>
                <td>{course.completionRate}%</td>
                <td>
                  <div className="flex items-center gap-1">
                    <IconButton label="Edit" icon={Edit3} onClick={() => onEdit(course)} />
                    <IconButton label="Publish" icon={Eye} onClick={() => onTogglePublish(course.id)} />
                    <IconButton label="Add module" icon={Plus} onClick={() => onAddModule(course.id)} />
                    <IconButton label="Delete" icon={Trash2} danger onClick={() => onDelete(course.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function IconButton({ label, icon: Icon, onClick, danger = false }) {
  return (
    <button className={`rounded-lg p-2 ${danger ? 'text-rose-600 hover:bg-rose-50' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`} onClick={onClick} title={label} aria-label={label}>
      <Icon className="h-4 w-4" />
    </button>
  );
}

function CourseModal({ editing, form, onChange, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <form className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl" onSubmit={onSave}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{editing ? 'Edit Course' : 'Create Course'}</h2>
          <button type="button" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4">
          <Input label="Title" value={form.title} onChange={(value) => onChange({ ...form, title: value })} required />
          <Input label="Short Description" value={form.shortDescription} onChange={(value) => onChange({ ...form, shortDescription: value })} />
          <label className="text-sm font-semibold">
            Description
            <textarea className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand-500" value={form.description} onChange={(event) => onChange({ ...form, description: event.target.value })} />
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            <Select label="Category" value={form.category} values={['Web Dev', 'Backend', 'Data Science', 'Design']} onChange={(value) => onChange({ ...form, category: value })} />
            <Select label="Level" value={form.level} values={['Beginner', 'Intermediate', 'Advanced']} onChange={(value) => onChange({ ...form, level: value })} />
            <Select label="Status" value={form.status} values={['draft', 'published']} onChange={(value) => onChange({ ...form, status: value })} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={onClose}>Cancel</button>
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Save Course</button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, required = false }) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <input required={required} className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand-500" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Select({ label, value, values, onChange }) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <select className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand-500" value={value} onChange={(event) => onChange(event.target.value)}>
        {values.map((item) => <option key={item}>{item}</option>)}
      </select>
    </label>
  );
}

function StudentsTable() {
  return (
    <Panel title="Enrolled Students">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-400">
            <tr><th className="py-3">Student</th><th>Course</th><th>Enrollment</th><th>Progress</th><th>Quiz Avg</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {seedStudents.map((student) => (
              <tr key={student.id}>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <img className="h-10 w-10 rounded-full object-cover" src={student.avatar} alt={student.name} />
                    <div><p className="font-semibold">{student.name}</p><p className="text-xs text-slate-500">{student.email}</p></div>
                  </div>
                </td>
                <td>{student.course}</td>
                <td className="text-slate-500">{student.date}</td>
                <td><Progress value={student.progress} /></td>
                <td className="font-bold">{student.quizAvg}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function Analytics({ courses }) {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      {courses.map((course) => (
        <Panel key={course.id}>
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="font-bold">{course.title}</p>
              <p className="text-sm text-slate-500">{course.studentsCount} students</p>
            </div>
            <Settings className="h-5 w-5 text-slate-400" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Metric label="Completion Rate" value={`${course.completionRate}%`} />
            <Metric label="Published Status" value={course.status} />
          </div>
        </Panel>
      ))}
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-bold capitalize">{value}</p>
    </div>
  );
}

function Profile({ role }) {
  return (
    <Panel>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <img className="h-24 w-24 rounded-2xl object-cover" src={demoUser.avatar} alt={demoUser.name} />
        <div>
          <p className="text-2xl font-bold">{demoUser.name}</p>
          <p className="text-slate-500">{demoUser.email}</p>
          <span className="mt-3 inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold capitalize text-brand-700">{role}</span>
        </div>
      </div>
    </Panel>
  );
}

export default App;
