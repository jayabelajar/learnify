import {
  Activity,
  AreaChart as AreaChartIcon,
  Award,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Edit3,
  Eye,
  FileText,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LibraryBig,
  Lock,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  PlayCircle,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  TrendingUp,
  User,
  Users,
  X
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { seedCourses, seedQuizResults, seedStudents } from './data/demoData';

type Role = 'student' | 'instructor' | 'admin';

type UserProfile = {
  name: string;
  email: string;
  role: Role;
  avatar: string;
  password: string;
};

type Lesson = {
  id: string;
  title: string;
  type: 'video' | 'text' | 'pdf';
  duration: number;
  completed: boolean;
  description: string;
};

type Quiz = {
  id: string;
  title: string;
  passingScore: number;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
};

type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
  quiz?: Quiz;
};

type Course = {
  id: string;
  title: string;
  category: string;
  level: string;
  instructor: string;
  rating: number;
  status: 'published' | 'draft';
  studentsCount: number;
  completionRate: number;
  progress: number;
  isEnrolled: boolean;
  thumbnail: string;
  description: string;
  modules: Module[];
};

const roleProfiles: Record<Role, UserProfile> = {
  student: {
    name: 'Alex Rivera',
    email: 'student@learnify.io',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    password: 'password123'
  },
  instructor: {
    name: 'Sarah Wijaya',
    email: 'instructor@learnify.io',
    role: 'instructor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
    password: 'password123'
  },
  admin: {
    name: 'Admin Learnify',
    email: 'admin@learnify.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    password: 'password123'
  }
};

const studentNav = [
  { id: 'student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'explore', label: 'Explore Courses', icon: Compass },
  { id: 'my-learning', label: 'My Learning', icon: BookOpen },
  { id: 'quiz-results', label: 'Quiz Results', icon: Award },
  { id: 'profile', label: 'Profile', icon: User }
];

const instructorNav = [
  { id: 'instructor-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'course-mgmt', label: 'Courses', icon: FolderKanban },
  { id: 'content-builder', label: 'Course Content', icon: LibraryBig },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: AreaChartIcon },
  { id: 'profile', label: 'Profile', icon: User }
];

const adminNav = [
  { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'admin-users', label: 'Users', icon: Users },
  { id: 'admin-courses', label: 'Courses', icon: LibraryBig },
  { id: 'admin-reports', label: 'Reports', icon: Activity },
  { id: 'admin-settings', label: 'Settings', icon: Settings },
  { id: 'profile', label: 'Profile', icon: User }
];

const categoryColors = ['#4F46E5', '#10B981', '#F59E0B', '#64748B'];
const notifications = [
  { id: 1, title: 'New enrollment', body: 'Dewi joined Modern React Development.', time: '5m' },
  { id: 2, title: 'Quiz submitted', body: 'Marcus completed Node Architecture Check.', time: '22m' },
  { id: 3, title: 'Course review', body: 'UI/UX Design is ready for publishing review.', time: '1h' }
];

function initialRole(): Role {
  const path = window.location.pathname;
  if (path.includes('/login/admin') || path.includes('/admin')) return 'admin';
  if (path.includes('/login/instructor') || path.includes('/instructor')) return 'instructor';
  return 'student';
}

function initialTab(role: Role) {
  if (role === 'admin') return 'admin-dashboard';
  if (role === 'instructor') return 'instructor-dashboard';
  return 'student-dashboard';
}

export default function App() {
  const startRole = initialRole();
  const [role, setRole] = useState<Role>(startRole);
  const [activeTab, setActiveTab] = useState(initialTab(startRole));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [courses, setCourses] = useState<Course[]>(seedCourses as Course[]);
  const [users, setUsers] = useState<UserProfile[]>(Object.values(roleProfiles));
  const [profile, setProfile] = useState<UserProfile>(roleProfiles[startRole]);
  const [quizResults, setQuizResults] = useState(seedQuizResults);
  const [courseSearch, setCourseSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [completion, setCompletion] = useState('All');
  const [selectedCourseId, setSelectedCourseId] = useState(seedCourses[0].id);
  const [selectedCourse, setSelectedCourse] = useState<Course>(seedCourses[0] as Course);
  const [activeLesson, setActiveLesson] = useState<Lesson>((seedCourses[0].modules[0].lessons[0] as Lesson));
  const [activeQuiz, setActiveQuiz] = useState<(Quiz & { courseTitle: string }) | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState(emptyCourse());

  const navItems = role === 'student' ? studentNav : role === 'instructor' ? instructorNav : adminNav;
  const enrolledCourses = courses.filter((course) => course.isEnrolled);
  const allLessons = courses.flatMap((course) => course.modules.flatMap((module) => module.lessons));
  const completedLessons = allLessons.filter((lesson) => lesson.completed).length;
  const selectedBuilderCourse = courses.find((course) => course.id === selectedCourseId) || courses[0];
  const searchResults = useMemo(() => {
    if (!globalSearch.trim()) return [];
    const query = globalSearch.toLowerCase();
    return [
      ...courses
        .filter((course) => `${course.title} ${course.category} ${course.instructor}`.toLowerCase().includes(query))
        .slice(0, 4)
        .map((course) => ({ id: course.id, title: course.title, type: 'Course', target: role === 'student' ? 'explore' : 'course-mgmt' })),
      ...navItems
        .filter((item) => item.label.toLowerCase().includes(query))
        .slice(0, 3)
        .map((item) => ({ id: item.id, title: item.label, type: 'Menu', target: item.id }))
    ];
  }, [courses, globalSearch, navItems, role]);

  const filteredExploreCourses = filterCourses(courses.filter((course) => course.status === 'published'), courseSearch, category, level);
  const filteredLearning = filterCourses(enrolledCourses, courseSearch, category, level).filter((course) => {
    if (completion === 'Completed') return course.progress === 100;
    if (completion === 'In Progress') return course.progress > 0 && course.progress < 100;
    if (completion === 'Not Started') return course.progress === 0;
    return true;
  });

  const studentKpis = {
    enrolled: enrolledCourses.length,
    completed: enrolledCourses.filter((course) => course.progress === 100).length,
    lessonsDone: completedLessons,
    avgScore: Math.round(quizResults.reduce((sum, item) => sum + item.score, 0) / quizResults.length)
  };

  function goToLogin(nextRole: Role) {
    window.history.pushState({}, '', `/login/${nextRole}`);
    setRole(nextRole);
    setActiveTab(initialTab(nextRole));
    setProfile(roleProfiles[nextRole]);
    setMobileSidebarOpen(false);
  }

  function navigate(tab: string) {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
    setSearchOpen(false);
  }

  function saveProfile(nextProfile: UserProfile) {
    setProfile(nextProfile);
    setUsers((items) => items.map((item) => (item.role === nextProfile.role ? nextProfile : item)));
  }

  function toggleEnrollment(courseId: string) {
    setCourses((items) =>
      items.map((course) => (course.id === courseId ? { ...course, isEnrolled: !course.isEnrolled } : course))
    );
  }

  function openLesson(course: Course, lesson?: Lesson) {
    const firstLesson = lesson || course.modules.flatMap((module) => module.lessons)[0];
    setSelectedCourse(course);
    setActiveLesson(firstLesson);
    setActiveTab('lesson-player');
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

  function saveCourse(event: React.FormEvent) {
    event.preventDefault();
    if (editingCourse) {
      setCourses((items) =>
        items.map((course) => (course.id === editingCourse.id ? ({ ...course, ...courseForm } as Course) : course))
      );
    } else {
      setCourses((items) => [
        {
          ...(courseForm as unknown as Course),
          id: crypto.randomUUID(),
          instructor: profile.name,
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

  function addModule(courseId: string) {
    setCourses((items) =>
      items.map((course) =>
        course.id === courseId
          ? {
              ...course,
              modules: [...course.modules, { id: crypto.randomUUID(), title: `Module ${course.modules.length + 1}`, lessons: [] }]
            }
          : course
      )
    );
  }

  function addLesson(courseId: string, moduleId: string) {
    setCourses((items) =>
      items.map((course) =>
        course.id === courseId
          ? {
              ...course,
              modules: course.modules.map((module) =>
                module.id === moduleId
                  ? {
                      ...module,
                      lessons: [
                        ...module.lessons,
                        {
                          id: crypto.randomUUID(),
                          title: `New Lesson ${module.lessons.length + 1}`,
                          type: 'text',
                          duration: 10,
                          completed: false,
                          description: 'Draft lesson material description.'
                        }
                      ]
                    }
                  : module
              )
            }
          : course
      )
    );
  }

  function deleteLesson(courseId: string, moduleId: string, lessonId: string) {
    setCourses((items) =>
      items.map((course) =>
        course.id === courseId
          ? {
              ...course,
              modules: course.modules.map((module) =>
                module.id === moduleId ? { ...module, lessons: module.lessons.filter((lesson) => lesson.id !== lessonId) } : module
              )
            }
          : course
      )
    );
  }

  function startQuiz(quiz: Quiz, course: Course) {
    setActiveQuiz({ ...quiz, courseTitle: course.title });
    setAnswers({});
    setQuestionIndex(0);
    setActiveTab('quiz-view');
  }

  function submitQuiz() {
    if (!activeQuiz) return;
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
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-900">
      <Sidebar
        role={role}
        items={navItems}
        activeTab={activeTab}
        open={sidebarOpen}
        mobileOpen={mobileSidebarOpen}
        onNavigate={navigate}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />
      {mobileSidebarOpen && (
        <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} aria-label="Close sidebar" />
      )}

      <div className={`flex h-screen min-w-0 flex-col transition-all duration-200 ${sidebarOpen ? 'lg:pl-72' : 'lg:pl-20'}`}>
        <Topbar
          role={role}
          profile={profile}
          sidebarOpen={sidebarOpen}
          notificationOpen={notificationOpen}
          profileOpen={profileOpen}
          searchOpen={searchOpen}
          search={globalSearch}
          searchResults={searchResults}
          onToggleSidebar={() => setSidebarOpen((value) => !value)}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onSearch={setGlobalSearch}
          onToggleSearch={() => setSearchOpen((value) => !value)}
          onToggleNotifications={() => {
            setNotificationOpen((value) => !value);
            setProfileOpen(false);
          }}
          onToggleProfile={() => {
            setProfileOpen((value) => !value);
            setNotificationOpen(false);
          }}
          onNavigate={navigate}
          onLoginAs={goToLogin}
        />

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
            {activeTab.startsWith('login-') && <LoginPage role={role} onLogin={() => navigate(initialTab(role))} onSwitch={goToLogin} />}

            {role === 'student' && activeTab === 'student-dashboard' && (
              <StudentDashboard kpis={studentKpis} courses={enrolledCourses} quizResults={quizResults} onExplore={() => navigate('explore')} onOpenLesson={openLesson} />
            )}
            {role === 'student' && activeTab === 'explore' && (
              <ExploreCourses
                courses={filteredExploreCourses}
                search={courseSearch}
                category={category}
                level={level}
                onSearch={setCourseSearch}
                onCategory={setCategory}
                onLevel={setLevel}
                onEnroll={toggleEnrollment}
                onOpenLesson={openLesson}
              />
            )}
            {role === 'student' && activeTab === 'my-learning' && (
              <MyLearning
                courses={filteredLearning}
                search={courseSearch}
                category={category}
                level={level}
                completion={completion}
                onSearch={setCourseSearch}
                onCategory={setCategory}
                onLevel={setLevel}
                onCompletion={setCompletion}
                onOpenLesson={openLesson}
                onStartQuiz={startQuiz}
              />
            )}
            {role === 'student' && activeTab === 'lesson-player' && (
              <LessonPlayer course={selectedCourse} activeLesson={activeLesson} onSelectLesson={setActiveLesson} onComplete={markLessonComplete} onBack={() => navigate('my-learning')} />
            )}
            {role === 'student' && activeTab === 'quiz-view' && activeQuiz && (
              <QuizView quiz={activeQuiz} answers={answers} index={questionIndex} onAnswer={(questionId, answer) => setAnswers((items) => ({ ...items, [questionId]: answer }))} onIndex={setQuestionIndex} onSubmit={submitQuiz} />
            )}
            {role === 'student' && activeTab === 'quiz-results' && <QuizResults results={quizResults} />}

            {role === 'instructor' && activeTab === 'instructor-dashboard' && <InstructorDashboard courses={courses} />}
            {role === 'instructor' && activeTab === 'course-mgmt' && (
              <CourseManagement
                courses={courses.filter((course) => course.title.toLowerCase().includes(courseSearch.toLowerCase()))}
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
                    items.map((course) => (course.id === courseId ? { ...course, status: course.status === 'published' ? 'draft' : 'published' } : course))
                  )
                }
                onManage={(courseId) => {
                  setSelectedCourseId(courseId);
                  navigate('content-builder');
                }}
              />
            )}
            {role === 'instructor' && activeTab === 'content-builder' && (
              <ContentBuilder
                courses={courses}
                selectedCourse={selectedBuilderCourse}
                onSelectCourse={setSelectedCourseId}
                onAddModule={addModule}
                onAddLesson={addLesson}
                onDeleteLesson={deleteLesson}
              />
            )}
            {role === 'instructor' && activeTab === 'students' && <StudentsTable />}
            {role === 'instructor' && activeTab === 'analytics' && <Analytics courses={courses} />}

            {role === 'admin' && activeTab === 'admin-dashboard' && <AdminDashboard users={users} courses={courses} />}
            {role === 'admin' && activeTab === 'admin-users' && <AdminUsers users={users} onUsers={setUsers} />}
            {role === 'admin' && activeTab === 'admin-courses' && <AdminCourses courses={courses} />}
            {role === 'admin' && activeTab === 'admin-reports' && <AdminReports courses={courses} />}
            {role === 'admin' && activeTab === 'admin-settings' && <AdminSettings />}

            {activeTab === 'profile' && <ProfilePage profile={profile} onSave={saveProfile} />}
          </div>
        </main>
      </div>

      {showCourseModal && (
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

function filterCourses(courses: Course[], search: string, category: string, level: string) {
  const query = search.toLowerCase();
  return courses.filter((course) => {
    const matchesSearch = `${course.title} ${course.instructor} ${course.category}`.toLowerCase().includes(query);
    const matchesCategory = category === 'All' || course.category === category;
    const matchesLevel = level === 'All' || course.level === level;
    return matchesSearch && matchesCategory && matchesLevel;
  });
}

function emptyCourse() {
  return {
    title: '',
    shortDescription: '',
    description: '',
    category: 'Web Dev',
    level: 'Beginner',
    status: 'draft',
    modules: []
  };
}

function Sidebar({ role, items, activeTab, open, mobileOpen, onNavigate, onCloseMobile }: any) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex border-r border-slate-200 bg-white transition-all duration-200 ${
        open ? 'lg:w-72' : 'lg:w-20'
      } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} w-72`}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4">
          <Brand collapsed={!open} role={role} />
          <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden" onClick={onCloseMobile} aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {items.map((item: any) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  active ? 'bg-brand-50 font-semibold text-brand-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                } ${!open ? 'lg:justify-center' : ''}`}
                onClick={() => onNavigate(item.id)}
                title={item.label}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className={`${!open ? 'lg:hidden' : ''}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="shrink-0 border-t border-slate-100 p-3">
          <div className={`rounded-xl bg-slate-50 p-3 text-xs text-slate-500 ${!open ? 'lg:hidden' : ''}`}>
            <p className="font-semibold capitalize text-slate-800">{role} workspace</p>
            <p className="mt-1">Role-based LMS navigation</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Brand({ collapsed = false, role }: { collapsed?: boolean; role?: Role }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm shadow-indigo-200">
        <BookOpen className="h-5 w-5" />
      </div>
      <div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
        <p className="truncate text-lg font-bold leading-none tracking-tight">Learnify</p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{role ? `${role} portal` : 'Learning platform'}</p>
      </div>
    </div>
  );
}

function Topbar(props: any) {
  const {
    role,
    profile,
    sidebarOpen,
    notificationOpen,
    profileOpen,
    searchOpen,
    search,
    searchResults,
    onToggleSidebar,
    onOpenMobileSidebar,
    onSearch,
    onToggleSearch,
    onToggleNotifications,
    onToggleProfile,
    onNavigate,
    onLoginAs
  } = props;

  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 md:px-6">
      <div className="flex items-center gap-2">
        <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={onOpenMobileSidebar} aria-label="Open sidebar">
          <Menu className="h-5 w-5" />
        </button>
        <button className="hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:inline-flex" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
        </button>
        <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" onClick={onToggleSearch} aria-label="Open search">
          <Search className="h-5 w-5" />
        </button>
        <div className="relative hidden w-80 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            onFocus={onToggleSearch}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:bg-white"
            placeholder="Search courses, students, menus..."
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100" onClick={onToggleNotifications} aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-600" />
        </button>
        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100" onClick={onToggleProfile} aria-label="Profile menu">
          <img className="h-8 w-8 rounded-full object-cover" src={profile.avatar} alt={profile.name} />
          <span className="hidden text-sm font-semibold md:block">{profile.name}</span>
          <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
        </button>
      </div>

      {(searchOpen || search) && (
        <FloatingPanel className="left-3 right-3 top-16 md:left-20 md:right-auto md:w-[440px]">
          <div className="md:hidden">
            <input
              autoFocus
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
              placeholder="Search anything..."
            />
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Shortcut menu</p>
          <div className="grid gap-1">
            {(searchResults.length ? searchResults : [
              { id: 'profile', title: 'Open profile', type: 'Menu', target: 'profile' },
              { id: 'learning', title: role === 'student' ? 'My Learning' : 'Courses', type: 'Menu', target: role === 'student' ? 'my-learning' : role === 'admin' ? 'admin-users' : 'course-mgmt' },
              { id: 'analytics', title: role === 'student' ? 'Quiz Results' : 'Analytics', type: 'Menu', target: role === 'student' ? 'quiz-results' : role === 'admin' ? 'admin-reports' : 'analytics' }
            ]).map((item: any) => (
              <button key={`${item.type}-${item.id}`} className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50" onClick={() => onNavigate(item.target)}>
                <span className="font-medium">{item.title}</span>
                <span className="text-xs text-slate-400">{item.type}</span>
              </button>
            ))}
          </div>
        </FloatingPanel>
      )}

      {notificationOpen && (
        <FloatingPanel className="right-3 top-16 w-[min(360px,calc(100vw-24px))]">
          <p className="mb-3 font-bold">Notifications</p>
          <div className="space-y-2">
            {notifications.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-100 p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <span className="text-xs text-slate-400">{item.time}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{item.body}</p>
              </div>
            ))}
          </div>
        </FloatingPanel>
      )}

      {profileOpen && (
        <FloatingPanel className="right-3 top-16 w-[min(320px,calc(100vw-24px))]">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <img className="h-12 w-12 rounded-full object-cover" src={profile.avatar} alt={profile.name} />
            <div className="min-w-0">
              <p className="truncate font-bold">{profile.name}</p>
              <p className="truncate text-sm text-slate-500">{profile.email}</p>
              <span className="mt-1 inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold capitalize text-brand-700">{profile.role}</span>
            </div>
          </div>
          <div className="mt-3 grid gap-2">
            <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-50" onClick={() => onNavigate('profile')}>
              <Edit3 className="h-4 w-4" /> Edit Profile
            </button>
            <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Login pages</p>
            <div className="grid grid-cols-3 gap-2">
              {(['student', 'instructor', 'admin'] as Role[]).map((item) => (
                <button key={item} className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold capitalize hover:bg-slate-50" onClick={() => onLoginAs(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        </FloatingPanel>
      )}
    </header>
  );
}

function FloatingPanel({ children, className = '' }: any) {
  return <div className={`absolute rounded-xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 ${className}`}>{children}</div>;
}

function LoginPage({ role, onLogin, onSwitch }: { role: Role; onLogin: () => void; onSwitch: (role: Role) => void }) {
  return (
    <section className="grid min-h-[calc(100vh-8rem)] place-items-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Brand role={role} />
        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">{role} login</p>
          <h1 className="mt-1 text-2xl font-bold">Welcome to Learnify</h1>
          <p className="mt-2 text-sm text-slate-500">Use the role-specific login page for a focused dashboard experience.</p>
        </div>
        <div className="mt-6 grid gap-4">
          <Input label="Email" value={roleProfiles[role].email} onChange={() => null} />
          <Input label="Password" type="password" value="password123" onChange={() => null} />
          <button className="rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700" onClick={onLogin}>
            Login as {role}
          </button>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {(['student', 'instructor', 'admin'] as Role[]).map((item) => (
            <button key={item} className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold capitalize hover:bg-slate-50" onClick={() => onSwitch(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function StudentDashboard({ kpis, courses, quizResults, onExplore, onOpenLesson }: any) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-brand-600 to-slate-800 p-6 text-white shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Continue your learning path</h2>
          <p className="mt-1 text-sm text-indigo-100">Track enrolled courses, completed lessons, and recent quiz performance.</p>
        </div>
        <button className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 shadow-sm hover:bg-brand-50" onClick={onExplore}>Browse Courses</button>
      </div>
      <KpiGrid cards={[
        ['Enrolled Courses', kpis.enrolled, BookOpen, 'bg-brand-50 text-brand-600'],
        ['Completed Courses', kpis.completed, CheckCircle2, 'bg-emerald-50 text-emerald-600'],
        ['Lessons Completed', kpis.lessonsDone, PlayCircle, 'bg-amber-50 text-amber-600'],
        ['Average Quiz Score', `${kpis.avgScore}%`, Award, 'bg-slate-100 text-slate-700']
      ]} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="Continue Learning">
          <div className="space-y-4">{courses.slice(0, 3).map((course: Course) => <CourseRow key={course.id} course={course} onOpen={() => onOpenLesson(course)} />)}</div>
        </Panel>
        <Panel title="Recent Quiz Results">
          <div className="space-y-3">{quizResults.slice(0, 4).map((result: any) => <ResultRow key={result.id} result={result} />)}</div>
        </Panel>
      </div>
    </section>
  );
}

function KpiGrid({ cards }: any) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(([label, value, Icon, color]: any) => (
        <div key={label} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className={`rounded-xl p-3 ${color}`}><Icon className="h-6 w-6" /></div>
          <div><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>
        </div>
      ))}
    </div>
  );
}

function Panel({ title = null, children, className = '' }: any) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {title && <h3 className="mb-4 text-base font-bold">{title}</h3>}
      {children}
    </section>
  );
}

function CourseRow({ course, onOpen }: { course: Course; onOpen: () => void }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center">
      <img className="h-28 w-full rounded-lg object-cover sm:h-16 sm:w-24" src={course.thumbnail} alt={course.title} />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{course.title}</p>
        <p className="text-sm text-slate-500">{course.instructor}</p>
        <Progress value={course.progress} />
      </div>
      <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" onClick={onOpen}>Continue</button>
    </div>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div className="mt-3 flex items-center gap-3">
      <div className="h-2 flex-1 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-brand-600" style={{ width: `${value}%` }} /></div>
      <span className="w-10 text-right text-xs font-semibold text-slate-600">{value}%</span>
    </div>
  );
}

function ResultRow({ result }: any) {
  return (
    <div className="rounded-lg border border-slate-100 p-3">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-sm font-semibold">{result.quizTitle}</p><p className="text-xs text-slate-500">{result.courseTitle}</p></div>
        <span className={`rounded-full px-2 py-1 text-xs font-bold ${result.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{result.score}%</span>
      </div>
      <p className="mt-2 text-xs text-slate-400">{result.date}</p>
    </div>
  );
}

function CourseFilters({ search, category, level, completion, onSearch, onCategory, onLevel, onCompletion, showCompletion = false }: any) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_180px]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={(event) => onSearch(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-brand-500" placeholder="Search courses..." />
      </div>
      <Select value={category} values={['All', 'Web Dev', 'Backend', 'Data Science', 'Design']} onChange={onCategory} />
      <Select value={level} values={['All', 'Beginner', 'Intermediate', 'Advanced']} onChange={onLevel} />
      {showCompletion && <Select value={completion} values={['All', 'Completed', 'In Progress', 'Not Started']} onChange={onCompletion} />}
    </div>
  );
}

function ExploreCourses(props: any) {
  return (
    <section className="space-y-5">
      <CourseFilters {...props} />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {props.courses.map((course: Course) => <CourseCard key={course.id} course={course} onEnroll={() => props.onEnroll(course.id)} onOpen={() => props.onOpenLesson(course)} />)}
      </div>
    </section>
  );
}

function CourseCard({ course, onEnroll, onOpen }: any) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <img className="h-40 w-full object-cover" src={course.thumbnail} alt={course.title} />
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{course.category}</span>
          <span className="text-xs font-medium text-slate-500">{course.level}</span>
        </div>
        <div><h3 className="font-bold">{course.title}</h3><p className="mt-2 line-clamp-2 text-sm text-slate-500">{course.description}</p></div>
        <div className="flex items-center justify-between text-sm text-slate-500"><span>{course.instructor}</span><span>{course.studentsCount} students</span></div>
        {course.isEnrolled && <Progress value={course.progress} />}
        <div className="grid grid-cols-2 gap-2">
          <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={onEnroll}>{course.isEnrolled ? 'Enrolled' : 'Enroll'}</button>
          <button className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700" onClick={onOpen}>View</button>
        </div>
      </div>
    </article>
  );
}

function MyLearning(props: any) {
  return (
    <section className="space-y-5">
      <CourseFilters {...props} showCompletion />
      <div className="grid gap-5 lg:grid-cols-2">
        {props.courses.map((course: Course) => (
          <Panel key={course.id}>
            <div className="flex flex-col gap-4 sm:flex-row">
              <img className="h-32 rounded-lg object-cover sm:w-40" src={course.thumbnail} alt={course.title} />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold">{course.title}</p>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${course.progress === 100 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {course.progress === 100 ? 'Completed' : course.progress > 0 ? 'In Progress' : 'Not Started'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{course.description}</p>
                <Progress value={course.progress} />
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => props.onOpenLesson(course)}>Open Course</button>
                  {course.modules.flatMap((module) => (module.quiz ? [module.quiz] : [])).map((quiz) => (
                    <button key={quiz.id} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700" onClick={() => props.onStartQuiz(quiz, course)}>Start Quiz</button>
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

function LessonPlayer({ course, activeLesson, onSelectLesson, onComplete, onBack }: any) {
  return (
    <section className="grid gap-6 xl:grid-cols-[340px_1fr]">
      <Panel>
        <button className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600" onClick={onBack}><ChevronLeft className="h-4 w-4" /> My Learning</button>
        <h2 className="font-bold">{course.title}</h2>
        <Progress value={course.progress} />
        <div className="mt-5 space-y-4">
          {course.modules.map((module: Module) => (
            <div key={module.id}>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">{module.title}</p>
              <div className="space-y-2">
                {module.lessons.map((lesson) => (
                  <button key={lesson.id} className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm ${activeLesson?.id === lesson.id ? 'border-brand-200 bg-brand-50 text-brand-700' : 'border-slate-100 hover:bg-slate-50'}`} onClick={() => onSelectLesson(lesson)}>
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
        <div className="mb-5 flex h-72 items-center justify-center rounded-xl bg-slate-900 text-white">{activeLesson?.type === 'pdf' ? <FileText className="h-16 w-16" /> : <PlayCircle className="h-16 w-16" />}</div>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div><p className="text-sm font-semibold uppercase tracking-wide text-brand-600">{activeLesson?.type} lesson</p><h2 className="mt-1 text-2xl font-bold">{activeLesson?.title}</h2><p className="mt-3 max-w-2xl text-slate-600">{activeLesson?.description}</p></div>
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white" onClick={onComplete}>Mark Complete</button>
        </div>
      </Panel>
    </section>
  );
}

function QuizView({ quiz, answers, index, onAnswer, onIndex, onSubmit }: any) {
  const question = quiz.questions[index];
  const isLast = index === quiz.questions.length - 1;
  return (
    <Panel>
      <div className="mb-6 flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-brand-600">Question {index + 1} of {quiz.questions.length}</p><h2 className="mt-1 text-2xl font-bold">{quiz.title}</h2></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Passing {quiz.passingScore}%</span></div>
      <h3 className="text-lg font-semibold">{question.question}</h3>
      <div className="mt-5 grid gap-3">{question.options.map((option: string, optionIndex: number) => <button key={option} className={`rounded-xl border px-4 py-3 text-left text-sm font-medium ${answers[question.id] === optionIndex ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 hover:bg-slate-50'}`} onClick={() => onAnswer(question.id, optionIndex)}>{option}</button>)}</div>
      <div className="mt-6 flex items-center justify-between"><button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold disabled:opacity-40" disabled={index === 0} onClick={() => onIndex(index - 1)}>Previous</button>{isLast ? <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white" onClick={onSubmit}>Submit Quiz</button> : <button className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => onIndex(index + 1)}>Next <ChevronRight className="h-4 w-4" /></button>}</div>
    </Panel>
  );
}

function QuizResults({ results }: any) {
  return <DataTable title="Quiz Results" headers={['Quiz', 'Course', 'Score', 'Status', 'Date']} rows={results.map((r: any) => [r.quizTitle, r.courseTitle, `${r.score}%`, r.passed ? 'Pass' : 'Fail', r.date])} />;
}

function InstructorDashboard({ courses }: { courses: Course[] }) {
  const published = courses.filter((course) => course.status === 'published').length;
  const totalStudents = courses.reduce((sum, course) => sum + course.studentsCount, 0);
  const avgCompletion = Math.round(courses.reduce((sum, course) => sum + course.completionRate, 0) / courses.length);
  return (
    <section className="space-y-6">
      <KpiGrid cards={[
        ['Total Courses', courses.length, FolderKanban, 'bg-brand-50 text-brand-600'],
        ['Published Courses', published, Eye, 'bg-emerald-50 text-emerald-600'],
        ['Total Students', totalStudents, Users, 'bg-amber-50 text-amber-600'],
        ['Avg Completion', `${avgCompletion}%`, TrendingUp, 'bg-slate-100 text-slate-700']
      ]} />
      <Analytics courses={courses} compact />
    </section>
  );
}

function CourseManagement({ courses, search, onSearch, onCreate, onEdit, onDelete, onTogglePublish, onManage }: any) {
  return (
    <Panel>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => onSearch(event.target.value)} className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-brand-500" placeholder="Search your courses..." /></div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white" onClick={onCreate}><Plus className="h-4 w-4" /> Create Course</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-400"><tr><th className="py-3">Course</th><th>Status</th><th>Students</th><th>Modules</th><th>Lessons</th><th>Completion</th><th>Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map((course: Course) => (
              <tr key={course.id}>
                <td className="py-4"><div className="flex items-center gap-3"><img className="h-12 w-16 rounded-lg object-cover" src={course.thumbnail} alt={course.title} /><div><p className="font-semibold">{course.title}</p><p className="text-xs text-slate-500">{course.category} - {course.level}</p></div></div></td>
                <td><Badge tone={course.status === 'published' ? 'green' : 'gray'}>{course.status}</Badge></td>
                <td>{course.studentsCount}</td><td>{course.modules.length}</td><td>{course.modules.flatMap((module) => module.lessons).length}</td><td>{course.completionRate}%</td>
                <td><div className="flex items-center gap-1"><IconButton label="Edit" icon={Edit3} onClick={() => onEdit(course)} /><IconButton label="Manage content" icon={LibraryBig} onClick={() => onManage(course.id)} /><IconButton label="Publish" icon={Eye} onClick={() => onTogglePublish(course.id)} /><IconButton label="Delete" icon={Trash2} danger onClick={() => onDelete(course.id)} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function ContentBuilder({ courses, selectedCourse, onSelectCourse, onAddModule, onAddLesson, onDeleteLesson }: any) {
  return (
    <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <Panel title="Courses">
        <div className="space-y-2">{courses.map((course: Course) => <button key={course.id} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${course.id === selectedCourse.id ? 'bg-brand-50 font-semibold text-brand-700' : 'hover:bg-slate-50'}`} onClick={() => onSelectCourse(course.id)}>{course.title}</button>)}</div>
      </Panel>
      <Panel>
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div><p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Course Builder</p><h2 className="text-2xl font-bold">{selectedCourse.title}</h2><p className="mt-1 text-sm text-slate-500">Manage modules, lessons, and quiz blocks for this course.</p></div>
          <button className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => onAddModule(selectedCourse.id)}><Plus className="h-4 w-4" /> Module</button>
        </div>
        <div className="space-y-4">
          {selectedCourse.modules.map((module: Module, moduleIndex: number) => (
            <div key={module.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Module {moduleIndex + 1}</p><h3 className="font-bold">{module.title}</h3></div>
                <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold" onClick={() => onAddLesson(selectedCourse.id, module.id)}><Plus className="h-4 w-4" /> Lesson</button>
              </div>
              <div className="mt-4 space-y-2">
                {module.lessons.map((lesson, lessonIndex) => (
                  <div key={lesson.id} className="flex flex-col gap-3 rounded-lg bg-slate-50 p-3 md:flex-row md:items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand-600">{lessonIndex + 1}</div>
                    <div className="flex-1"><p className="font-semibold">{lesson.title}</p><p className="text-xs text-slate-500">{lesson.type} - {lesson.duration} min</p></div>
                    <IconButton label="Delete lesson" icon={Trash2} danger onClick={() => onDeleteLesson(selectedCourse.id, module.id, lesson.id)} />
                  </div>
                ))}
                {module.quiz && <div className="rounded-lg border border-dashed border-brand-200 bg-brand-50 p-3 text-sm font-semibold text-brand-700">Quiz: {module.quiz.title}</div>}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function Analytics({ courses, compact = false }: { courses: Course[]; compact?: boolean }) {
  const chartData = courses.map((course) => ({ name: course.title.split(' ')[0], students: course.studentsCount, completion: course.completionRate }));
  return (
    <section className="grid gap-6 xl:grid-cols-3">
      <Panel className="xl:col-span-2" title="Enrollment and Completion Trend">
        <div className={compact ? 'h-72' : 'h-96'}>
          <ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="studentsFill" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} /><stop offset="95%" stopColor="#4F46E5" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Area type="monotone" dataKey="students" stroke="#4F46E5" fill="url(#studentsFill)" strokeWidth={3} /><Line type="monotone" dataKey="completion" stroke="#10B981" strokeWidth={2} /></AreaChart></ResponsiveContainer>
        </div>
      </Panel>
      <Panel title="Course Mix">
        <div className={compact ? 'h-72' : 'h-96'}>
          <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryBreakdown(courses)} dataKey="value" nameKey="name" innerRadius={55} outerRadius={100}>{categoryBreakdown(courses).map((entry, index) => <Cell key={entry.name} fill={categoryColors[index % categoryColors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </div>
      </Panel>
      {!compact && <Panel className="xl:col-span-3" title="Course Performance">
        <div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="completion" fill="#10B981" radius={[6, 6, 0, 0]} /><Bar dataKey="students" fill="#4F46E5" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
      </Panel>}
    </section>
  );
}

function categoryBreakdown(courses: Course[]) {
  return Object.entries(courses.reduce<Record<string, number>>((acc, course) => ({ ...acc, [course.category]: (acc[course.category] || 0) + 1 }), {})).map(([name, value]) => ({ name, value }));
}

function StudentsTable() {
  return <DataTable title="Enrolled Students" headers={['Student', 'Course', 'Enrollment', 'Progress', 'Quiz Avg']} rows={seedStudents.map((s) => [s.name, s.course, s.date, `${s.progress}%`, `${s.quizAvg}%`])} />;
}

function AdminDashboard({ users, courses }: any) {
  return <section className="space-y-6"><KpiGrid cards={[['Total Users', users.length, Users, 'bg-brand-50 text-brand-600'], ['Total Courses', courses.length, LibraryBig, 'bg-emerald-50 text-emerald-600'], ['Published', courses.filter((c: Course) => c.status === 'published').length, Eye, 'bg-amber-50 text-amber-600'], ['System Health', '99.9%', ShieldCheck, 'bg-slate-100 text-slate-700']]} /><Analytics courses={courses} compact /></section>;
}

function AdminUsers({ users, onUsers }: any) {
  return (
    <Panel title="User Management">
      <div className="grid gap-3">
        {users.map((user: UserProfile) => (
          <div key={user.email} className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 md:flex-row md:items-center">
            <img className="h-12 w-12 rounded-full object-cover" src={user.avatar} alt={user.name} />
            <div className="flex-1"><p className="font-semibold">{user.name}</p><p className="text-sm text-slate-500">{user.email}</p></div>
            <Badge tone={user.role === 'admin' ? 'indigo' : user.role === 'instructor' ? 'green' : 'gray'}>{user.role}</Badge>
            <IconButton label="Remove" icon={Trash2} danger onClick={() => onUsers(users.filter((item: UserProfile) => item.email !== user.email))} />
          </div>
        ))}
      </div>
    </Panel>
  );
}

function AdminCourses({ courses }: { courses: Course[] }) {
  return <DataTable title="Course Governance" headers={['Course', 'Instructor', 'Status', 'Students', 'Completion']} rows={courses.map((c) => [c.title, c.instructor, c.status, c.studentsCount, `${c.completionRate}%`])} />;
}

function AdminReports({ courses }: { courses: Course[] }) {
  return <Analytics courses={courses} />;
}

function AdminSettings() {
  return (
    <section className="grid gap-5 md:grid-cols-2">
      <Panel title="Platform Settings"><Toggle label="Require email verification" /><Toggle label="Allow public registration" /><Toggle label="Instructor course approval" /></Panel>
      <Panel title="Security"><Toggle label="JWT session monitoring" /><Toggle label="Admin notification digest" /><Toggle label="Maintenance mode" /></Panel>
    </section>
  );
}

function Toggle({ label }: { label: string }) {
  const [checked, setChecked] = useState(true);
  return <button className="mb-3 flex w-full items-center justify-between rounded-lg border border-slate-100 p-3 text-left text-sm font-semibold" onClick={() => setChecked((value) => !value)}><span>{label}</span><span className={`h-6 w-11 rounded-full p-1 transition ${checked ? 'bg-brand-600' : 'bg-slate-300'}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${checked ? 'translate-x-5' : ''}`} /></span></button>;
}

function ProfilePage({ profile, onSave }: { profile: UserProfile; onSave: (profile: UserProfile) => void }) {
  const [form, setForm] = useState(profile);
  return (
    <Panel>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-xl bg-slate-50 p-5 text-center">
          <img className="mx-auto h-28 w-28 rounded-2xl object-cover" src={form.avatar} alt={form.name} />
          <p className="mt-4 text-xl font-bold">{form.name}</p>
          <p className="text-sm text-slate-500">{form.email}</p>
          <Badge tone="indigo">{form.role}</Badge>
        </div>
        <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
          <Input label="Avatar URL" value={form.avatar} onChange={(value: string) => setForm({ ...form, avatar: value })} />
          <div className="grid gap-4 md:grid-cols-2"><Input label="Name" value={form.name} onChange={(value: string) => setForm({ ...form, name: value })} /><Input label="Email" value={form.email} onChange={(value: string) => setForm({ ...form, email: value })} /></div>
          <div className="grid gap-4 md:grid-cols-2"><Input label="Password" type="password" value={form.password} onChange={(value: string) => setForm({ ...form, password: value })} /><Input label="Confirm Password" type="password" value={form.password} onChange={() => null} /></div>
          <div className="flex flex-wrap justify-end gap-2"><button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => setForm(profile)}>Reset</button><button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Save Profile</button></div>
        </form>
      </div>
    </Panel>
  );
}

function CourseModal({ editing, form, onChange, onClose, onSave }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4">
      <form className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl" onSubmit={onSave}>
        <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-bold">{editing ? 'Edit Course' : 'Create Course'}</h2><button type="button" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button></div>
        <div className="grid gap-4">
          <Input label="Title" value={form.title} onChange={(value: string) => onChange({ ...form, title: value })} required />
          <Input label="Short Description" value={form.shortDescription || ''} onChange={(value: string) => onChange({ ...form, shortDescription: value })} />
          <label className="text-sm font-semibold">Description<textarea className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand-500" value={form.description} onChange={(event) => onChange({ ...form, description: event.target.value })} /></label>
          <div className="grid gap-3 sm:grid-cols-3"><LabeledSelect label="Category" value={form.category} values={['Web Dev', 'Backend', 'Data Science', 'Design']} onChange={(value: string) => onChange({ ...form, category: value })} /><LabeledSelect label="Level" value={form.level} values={['Beginner', 'Intermediate', 'Advanced']} onChange={(value: string) => onChange({ ...form, level: value })} /><LabeledSelect label="Status" value={form.status} values={['draft', 'published']} onChange={(value: string) => onChange({ ...form, status: value })} /></div>
        </div>
        <div className="mt-6 flex justify-end gap-2"><button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={onClose}>Cancel</button><button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Save Course</button></div>
      </form>
    </div>
  );
}

function DataTable({ title, headers, rows }: any) {
  return (
    <Panel title={title}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-400"><tr>{headers.map((h: string) => <th key={h} className="py-3">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">{rows.map((row: any[], index: number) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex} className="py-4 text-slate-700 first:font-semibold">{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </Panel>
  );
}

function IconButton({ label, icon: Icon, onClick, danger = false }: any) {
  return <button className={`rounded-lg p-2 ${danger ? 'text-rose-600 hover:bg-rose-50' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`} onClick={onClick} title={label} aria-label={label}><Icon className="h-4 w-4" /></button>;
}

function Input({ label, value, onChange, required = false, type = 'text' }: any) {
  return <label className="text-sm font-semibold">{label}<input type={type} required={required} className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand-500" value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function Select({ value, values, onChange }: any) {
  return <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-brand-500" value={value} onChange={(event) => onChange(event.target.value)}>{values.map((item: string) => <option key={item}>{item}</option>)}</select>;
}

function LabeledSelect({ label, value, values, onChange }: any) {
  return <label className="text-sm font-semibold">{label}<select className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand-500" value={value} onChange={(event) => onChange(event.target.value)}>{values.map((item: string) => <option key={item}>{item}</option>)}</select></label>;
}

function Badge({ children, tone = 'gray' }: any) {
  const tones: Record<string, string> = {
    green: 'bg-emerald-50 text-emerald-700',
    indigo: 'bg-brand-50 text-brand-700',
    gray: 'bg-slate-100 text-slate-600'
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${tones[tone] || tones.gray}`}>{children}</span>;
}
