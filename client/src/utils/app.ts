import type { Course, NavItem, Role } from '../types';
import { adminNav, instructorNav, studentNav } from '../data/navigation';

export const loginPathByRole: Record<Role, string> = {
  student: '/login/student',
  instructor: '/login/instructor',
  admin: '/login/admin'
};

export function navForRole(role: Role) {
  if (role === 'admin') return adminNav;
  if (role === 'instructor') return instructorNav;
  return studentNav;
}

export function pathForTab(role: Role, tab: string) {
  if (tab === 'landing') return '/';
  if (tab.startsWith('login-')) return loginPathByRole[role];
  if (tab === 'lesson-player') return '/course-detail';
  if (tab === 'course-detail') return `/${role}/courses/detail`;
  if (tab === 'assignment-detail') return `/${role}/assignments/detail`;
  if (tab === 'certificate-detail') return `/${role}/certificates/detail`;
  if (tab === 'quiz-detail') return `/${role}/quizzes/detail`;
  if (tab === 'quiz-view') return '/quiz';
  const path = navForRole(role).find((item) => item.id === tab)?.path || '/dashboard';
  return `/${role}${path}`;
}

export function roleFromPath(path = window.location.pathname): Role {
  if (path.includes('/login/admin')) return 'admin';
  if (path.includes('/login/instructor')) return 'instructor';
  if (path.includes('/admin')) return 'admin';
  if (path.includes('/instructor')) return 'instructor';
  if (path.includes('/student')) return 'student';
  return 'student';
}

export function initialRole(): Role {
  return roleFromPath();
}

export function initialTab(role: Role) {
  return navForRole(role)[0].id;
}

export function initialRouteTab(role: Role) {
  const path = window.location.pathname;
  if (path === '/') return 'landing';
  if (path.startsWith('/login/')) return `login-${role}`;
  const rolePrefix = `/${role}`;
  const localPath = path.startsWith(rolePrefix) ? path.slice(rolePrefix.length) || '/dashboard' : path;
  return navForRole(role).find((item) => item.path === localPath || item.path === path)?.id || initialTab(role);
}

export function filterCourses(courses: Course[], search: string, category: string, level: string) {
  const query = search.toLowerCase();
  return courses.filter((course) => {
    const matchesSearch = `${course.title} ${course.instructor} ${course.category}`.toLowerCase().includes(query);
    const matchesCategory = category === 'All' || course.category === category;
    const matchesLevel = level === 'All' || course.level === level;
    return matchesSearch && matchesCategory && matchesLevel;
  });
}

export function emptyCourse() {
  return {
    title: '',
    shortDescription: '',
    description: '',
    category: 'Web Dev',
    level: 'Beginner',
    status: 'draft' as const,
    modules: []
  };
}

export function buildSearchResults(courses: Course[], navItems: NavItem[], role: Role, globalSearch: string) {
  if (!globalSearch.trim()) return [];
  const query = globalSearch.toLowerCase();
  return [
    ...courses
      .filter((course) => `${course.title} ${course.category} ${course.instructor}`.toLowerCase().includes(query))
      .slice(0, 4)
      .map((course) => ({ id: course.id, title: course.title, type: 'Course', target: role === 'student' ? 'explore-courses' : 'courses' })),
    ...navItems
      .filter((item) => item.label.toLowerCase().includes(query))
      .slice(0, 3)
      .map((item) => ({ id: item.id, title: item.label, type: 'Menu', target: item.id }))
  ];
}

export function categoryBreakdown(courses: Course[]) {
  return Object.entries(courses.reduce<Record<string, number>>((acc, course) => ({ ...acc, [course.category]: (acc[course.category] || 0) + 1 }), {})).map(([name, value]) => ({ name, value }));
}
