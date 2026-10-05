import { useEffect, useMemo, useState } from 'react';
import { seedCourses, seedQuizResults } from '../data/demoData';
import { roleProfiles } from '../data/users';
import type { Course, Lesson, Quiz, Role, UserProfile } from '../types';
import { buildSearchResults, emptyCourse, filterCourses, initialRole, initialRouteTab, initialTab, loginPathByRole, navForRole, pathForTab } from '../utils/app';
import { authApi, courseApi, enrollmentApi, lessonApi, moduleApi, userApi } from '../services/api';

export type CourseForm = Partial<Course> & {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  level: string;
  status: 'draft' | 'published';
  modules: Course['modules'];
};

const authStorageKey = 'learnify-auth';

function normalizeProfile(user: any): UserProfile {
  return {
    name: user?.name || 'Learnify User',
    email: user?.email || '',
    role: user?.role || 'student',
    avatar: user?.avatar || roleProfiles[user?.role || 'student'].avatar,
    password: ''
  };
}

function normalizeCourse(course: any, enrolled = false, progress = 0): Course {
  const instructor = typeof course?.instructor === 'object' ? course.instructor?.name : course?.instructor;
  return {
    id: course?._id || course?.id,
    title: course?.title || 'Untitled Course',
    category: course?.category || 'General',
    level: course?.level || 'Beginner',
    instructor: instructor || 'Learnify Instructor',
    rating: course?.rating || 4.8,
    status: course?.status || 'draft',
    studentsCount: course?.studentsCount || 0,
    completionRate: course?.completionRate || 0,
    progress,
    isEnrolled: enrolled || Boolean(course?.isEnrolled),
    thumbnail: course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop&q=80',
    description: course?.description || '',
    shortDescription: course?.shortDescription || '',
    modules: (course?.modules || []).map((module: any) => ({
      id: module?._id || module?.id,
      title: module?.title || 'Module',
      lessons: (module?.lessons || []).map((lesson: any) => ({
        id: lesson?._id || lesson?.id,
        title: lesson?.title || 'Lesson',
        type: lesson?.type || 'article',
        duration: lesson?.duration || 0,
        completed: Boolean(lesson?.completed),
        description: lesson?.description || '',
        content: lesson?.content || '',
        videoUrl: lesson?.videoUrl || '',
        submissionInstructions: lesson?.submissionInstructions || '',
        quiz: lesson?.quiz?.title
          ? {
              id: lesson?.quiz?._id || lesson?.id,
              title: lesson.quiz.title,
              passingScore: lesson.quiz.passingScore || 70,
              questions: (lesson.quiz.questions || []).map((question: any, index: number) => ({
                id: question?._id || `${lesson?._id || lesson?.id}-q-${index}`,
                question: question.question,
                options: question.options || [],
                correctAnswer: question.correctAnswer || 0
              }))
            }
          : lesson?.quiz
      }))
    }))
  };
}

export function useLearnifyApp() {
  const startRole = initialRole();
  const [role, setRole] = useState<Role>(startRole);
  const [activeTab, setActiveTab] = useState(initialRouteTab(startRole));
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
  const [activeLesson, setActiveLesson] = useState<Lesson>(seedCourses[0].modules[0].lessons[0] as Lesson);
  const [activeQuiz, setActiveQuiz] = useState<(Quiz & { courseTitle: string }) | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState<CourseForm>(emptyCourse());
  const [authToken, setAuthToken] = useState<string>(() => JSON.parse(localStorage.getItem(authStorageKey) || 'null')?.token || '');

  useEffect(() => {
    if (window.location.pathname === '/') {
      window.history.replaceState({}, '', loginPathByRole[startRole]);
    }
  }, [startRole]);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem(authStorageKey) || 'null');
    if (!auth?.token || activeTab.startsWith('login-')) return;
    setAuthToken(auth.token);
    if (auth.user) {
      setRole(auth.user.role);
      setProfile(normalizeProfile(auth.user));
    }
    void loadRemoteData(auth.user?.role || role);
  }, []);

  async function loadRemoteData(nextRole: Role = role) {
    try {
      const courseResponse = await courseApi.list(nextRole === 'instructor' ? { mine: 'true' } : {});
      const remoteCourses = courseResponse.data.map((course: any) => normalizeCourse(course));

      if (nextRole === 'student') {
        const enrolledResponse = await enrollmentApi.myCourses();
        const enrolled = enrolledResponse.data.map((item: any) => normalizeCourse(item.course, true, item.progress || 0));
        const enrolledIds = new Set(enrolled.map((course: Course) => course.id));
        setCourses([...enrolled, ...remoteCourses.filter((course: Course) => !enrolledIds.has(course.id))]);
        return;
      }

      setCourses(remoteCourses.length ? remoteCourses : (seedCourses as Course[]));

      if (nextRole === 'admin') {
        const usersResponse = await userApi.list();
        setUsers(usersResponse.data.map(normalizeProfile));
      }
    } catch (_error) {
      setCourses(seedCourses as Course[]);
      setUsers(Object.values(roleProfiles));
    }
  }

  const navItems = navForRole(role);
  const enrolledCourses = courses.filter((course) => course.isEnrolled);
  const allLessons = courses.flatMap((course) => course.modules.flatMap((module) => module.lessons));
  const completedLessons = allLessons.filter((lesson) => lesson.completed).length;
  const selectedBuilderCourse = courses.find((course) => course.id === selectedCourseId) || courses[0];
  const searchResults = useMemo(() => buildSearchResults(courses, navItems, role, globalSearch), [courses, globalSearch, navItems, role]);
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
    window.history.pushState({}, '', loginPathByRole[nextRole]);
    setRole(nextRole);
    setActiveTab(`login-${nextRole}`);
    setProfile(roleProfiles[nextRole]);
    setMobileSidebarOpen(false);
  }

  function navigate(tab: string) {
    window.history.pushState({}, '', pathForTab(role, tab));
    setActiveTab(tab);
    setMobileSidebarOpen(false);
    setSearchOpen(false);
  }

  async function login(nextRole: Role = role, email = roleProfiles[nextRole].email, password = roleProfiles[nextRole].password) {
    const nextTab = initialTab(nextRole);
    try {
      const response = await authApi.login({ email, password, role: nextRole });
      localStorage.setItem(authStorageKey, JSON.stringify(response.data));
      setAuthToken(response.data.token);
      setProfile(normalizeProfile(response.data.user));
      await loadRemoteData(nextRole);
    } catch (_error) {
      setAuthToken('');
      setProfile(roleProfiles[nextRole]);
    }
    window.history.pushState({}, '', pathForTab(nextRole, nextTab));
    setRole(nextRole);
    setActiveTab(nextTab);
    setMobileSidebarOpen(false);
    setSearchOpen(false);
  }

  function logout() {
    localStorage.removeItem(authStorageKey);
    setAuthToken('');
    goToLogin(role);
    setProfileOpen(false);
  }

  function saveProfile(nextProfile: UserProfile) {
    setProfile(nextProfile);
    setUsers((items) => items.map((item) => (item.role === nextProfile.role ? nextProfile : item)));
  }

  function toggleEnrollment(courseId: string) {
    if (authToken) void enrollmentApi.enroll(courseId).then(() => loadRemoteData('student')).catch(() => null);
    setCourses((items) => items.map((course) => (course.id === courseId ? { ...course, isEnrolled: !course.isEnrolled } : course)));
  }

  function openLesson(course: Course, lesson?: Lesson) {
    const firstLesson = lesson || course.modules.flatMap((module) => module.lessons)[0];
    setSelectedCourse(course);
    setActiveLesson(firstLesson);
    navigate('lesson-player');
  }

  function markLessonComplete() {
    if (!activeLesson || !selectedCourse) return;
    if (authToken) void enrollmentApi.completeLesson(selectedCourse.id, activeLesson.id).catch(() => null);
    setCourses((items) =>
      items.map((course) => {
        if (course.id !== selectedCourse.id) return course;
        const modules = course.modules.map((module) => ({
          ...module,
          lessons: module.lessons.map((lesson) => (lesson.id === activeLesson.id ? { ...lesson, completed: true } : lesson))
        }));
        const lessons = modules.flatMap((module) => module.lessons);
        const progress = lessons.length ? Math.round((lessons.filter((lesson) => lesson.completed).length / lessons.length) * 100) : 0;
        const updated = { ...course, modules, progress };
        setSelectedCourse(updated);
        setActiveLesson({ ...activeLesson, completed: true });
        return updated;
      })
    );
  }

  async function saveCourse(event: React.FormEvent) {
    event.preventDefault();
    if (editingCourse) {
      if (authToken) void courseApi.update(editingCourse.id, courseForm).catch(() => null);
      setCourses((items) => items.map((course) => (course.id === editingCourse.id ? ({ ...course, ...courseForm } as Course) : course)));
    } else {
      if (authToken) {
        try {
          const response = await courseApi.create(courseForm);
          setCourses((items) => [normalizeCourse(response.data), ...items]);
          closeCourseModal();
          return;
        } catch (_error) {
          // Keep local fallback below for offline demo.
        }
      }
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
    closeCourseModal();
  }

  function openCreateCourseModal() {
    setEditingCourse(null);
    setCourseForm(emptyCourse());
    setShowCourseModal(true);
  }

  function openEditCourseModal(course: Course) {
    setEditingCourse(course);
    setCourseForm({ ...emptyCourse(), ...course });
    setShowCourseModal(true);
  }

  function closeCourseModal() {
    setShowCourseModal(false);
    setEditingCourse(null);
    setCourseForm(emptyCourse());
  }

  async function addModule(courseId: string) {
    const payload = { title: `Module ${(courses.find((course) => course.id === courseId)?.modules.length || 0) + 1}` };
    if (authToken) void moduleApi.create(courseId, payload).then(() => loadRemoteData(role)).catch(() => null);
    setCourses((items) =>
      items.map((course) =>
        course.id === courseId
          ? { ...course, modules: [...course.modules, { id: crypto.randomUUID(), title: `Module ${course.modules.length + 1}`, lessons: [] }] }
          : course
      )
    );
  }

  async function addLesson(courseId: string, moduleId: string) {
    const payload = {
      title: 'New Lesson',
      type: 'article',
      duration: 10,
      description: 'Draft lesson material description.',
      content: 'Write the lesson article content here.'
    };
    if (authToken) void lessonApi.create(moduleId, payload).then(() => loadRemoteData(role)).catch(() => null);
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
                          type: 'article',
                          duration: 10,
                          completed: false,
                          description: 'Draft lesson material description.',
                          content: 'Write the lesson article content here.'
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

  function updateLesson(courseId: string, moduleId: string, lessonId: string, patch: Partial<Lesson>) {
    if (authToken) void lessonApi.update(lessonId, patch).catch(() => null);
    setCourses((items) =>
      items.map((course) =>
        course.id === courseId
          ? {
              ...course,
              modules: course.modules.map((module) =>
                module.id === moduleId
                  ? { ...module, lessons: module.lessons.map((lesson) => (lesson.id === lessonId ? { ...lesson, ...patch } : lesson)) }
                  : module
              )
            }
          : course
      )
    );
  }

  function deleteLesson(courseId: string, moduleId: string, lessonId: string) {
    if (authToken) void lessonApi.remove(lessonId).catch(() => null);
    setCourses((items) =>
      items.map((course) =>
        course.id === courseId
          ? {
              ...course,
              modules: course.modules.map((module) => (module.id === moduleId ? { ...module, lessons: module.lessons.filter((lesson) => lesson.id !== lessonId) } : module))
            }
          : course
      )
    );
  }

  function togglePublish(courseId: string) {
    if (authToken) void courseApi.publish(courseId).catch(() => null);
    setCourses((items) => items.map((course) => (course.id === courseId ? { ...course, status: course.status === 'published' ? 'draft' : 'published' } : course)));
  }

  function deleteCourse(courseId: string) {
    if (authToken) void courseApi.remove(courseId).catch(() => null);
    setCourses((items) => items.filter((course) => course.id !== courseId));
  }

  function manageCourseContent(courseId: string) {
    setSelectedCourseId(courseId);
    navigate('course-builder');
  }

  function startQuiz(quiz: Quiz, course: Course) {
    setActiveQuiz({ ...quiz, courseTitle: course.title });
    setAnswers({});
    setQuestionIndex(0);
    navigate('quiz-view');
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
    navigate('quiz-results');
  }

  return {
    state: {
      role,
      activeTab,
      sidebarOpen,
      mobileSidebarOpen,
      notificationOpen,
      profileOpen,
      searchOpen,
      globalSearch,
      courses,
      users,
      profile,
      quizResults,
      courseSearch,
      category,
      level,
      completion,
      selectedCourse,
      selectedBuilderCourse,
      activeLesson,
      activeQuiz,
      answers,
      questionIndex,
      showCourseModal,
      editingCourse,
      courseForm,
      navItems,
      enrolledCourses,
      searchResults,
      filteredExploreCourses,
      filteredLearning,
      studentKpis
    },
    actions: {
      setSidebarOpen,
      setMobileSidebarOpen,
      setNotificationOpen,
      setProfileOpen,
      setSearchOpen,
      setGlobalSearch,
      setUsers,
      setCourseSearch,
      setCategory,
      setLevel,
      setCompletion,
      setSelectedCourseId,
      setActiveLesson,
      setAnswers,
      setQuestionIndex,
      setCourseForm,
      setCourses,
      goToLogin,
      navigate,
      saveProfile,
      toggleEnrollment,
      openLesson,
      markLessonComplete,
      saveCourse,
      openCreateCourseModal,
      openEditCourseModal,
      closeCourseModal,
      addModule,
      addLesson,
      deleteLesson,
      updateLesson,
      togglePublish,
      deleteCourse,
      manageCourseContent,
      login,
      logout,
      startQuiz,
      submitQuiz
    }
  };
}
