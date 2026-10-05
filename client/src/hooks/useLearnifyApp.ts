import { useMemo, useState } from 'react';
import { seedCourses, seedQuizResults } from '../data/demoData';
import { adminNav, instructorNav, studentNav } from '../data/navigation';
import { roleProfiles } from '../data/users';
import type { Course, Lesson, Quiz, Role, UserProfile } from '../types';
import { buildSearchResults, emptyCourse, filterCourses, initialRole, initialTab } from '../utils/app';

export type CourseForm = Partial<Course> & {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  level: string;
  status: 'draft' | 'published';
  modules: Course['modules'];
};

export function useLearnifyApp() {
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
  const [activeLesson, setActiveLesson] = useState<Lesson>(seedCourses[0].modules[0].lessons[0] as Lesson);
  const [activeQuiz, setActiveQuiz] = useState<(Quiz & { courseTitle: string }) | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState<CourseForm>(emptyCourse());

  const navItems = role === 'student' ? studentNav : role === 'instructor' ? instructorNav : adminNav;
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
    setCourses((items) => items.map((course) => (course.id === courseId ? { ...course, isEnrolled: !course.isEnrolled } : course)));
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

  function saveCourse(event: React.FormEvent) {
    event.preventDefault();
    if (editingCourse) {
      setCourses((items) => items.map((course) => (course.id === editingCourse.id ? ({ ...course, ...courseForm } as Course) : course)));
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

  function addModule(courseId: string) {
    setCourses((items) =>
      items.map((course) =>
        course.id === courseId
          ? { ...course, modules: [...course.modules, { id: crypto.randomUUID(), title: `Module ${course.modules.length + 1}`, lessons: [] }] }
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
              modules: course.modules.map((module) => (module.id === moduleId ? { ...module, lessons: module.lessons.filter((lesson) => lesson.id !== lessonId) } : module))
            }
          : course
      )
    );
  }

  function togglePublish(courseId: string) {
    setCourses((items) => items.map((course) => (course.id === courseId ? { ...course, status: course.status === 'published' ? 'draft' : 'published' } : course)));
  }

  function manageCourseContent(courseId: string) {
    setSelectedCourseId(courseId);
    navigate('content-builder');
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
      togglePublish,
      manageCourseContent,
      startQuiz,
      submitQuiz
    }
  };
}
