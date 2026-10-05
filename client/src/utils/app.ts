import type { Course, NavItem, Role } from '../types';

export function initialRole(): Role {
  const path = window.location.pathname;
  if (path.includes('/login/admin') || path.includes('/admin')) return 'admin';
  if (path.includes('/login/instructor') || path.includes('/instructor')) return 'instructor';
  return 'student';
}

export function initialTab(role: Role) {
  if (role === 'admin') return 'admin-dashboard';
  if (role === 'instructor') return 'instructor-dashboard';
  return 'student-dashboard';
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
      .map((course) => ({ id: course.id, title: course.title, type: 'Course', target: role === 'student' ? 'explore' : 'course-mgmt' })),
    ...navItems
      .filter((item) => item.label.toLowerCase().includes(query))
      .slice(0, 3)
      .map((item) => ({ id: item.id, title: item.label, type: 'Menu', target: item.id }))
  ];
}

export function categoryBreakdown(courses: Course[]) {
  return Object.entries(courses.reduce<Record<string, number>>((acc, course) => ({ ...acc, [course.category]: (acc[course.category] || 0) + 1 }), {})).map(([name, value]) => ({ name, value }));
}
