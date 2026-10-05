import {
  Activity,
  Bell,
  AreaChart as AreaChartIcon,
  Award,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Compass,
  FileBadge,
  FolderKanban,
  Heart,
  LayoutDashboard,
  LibraryBig,
  ListChecks,
  MessageSquare,
  ShieldCheck,
  Settings,
  Star,
  User,
  Users
} from 'lucide-react';
import type { NavItem } from '../types';

export const studentNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'explore-courses', label: 'Browse Courses', icon: Compass, path: '/explore-courses' },
  { id: 'my-learning', label: 'My Courses', icon: BookOpen, path: '/my-learning' },
  { id: 'assignments', label: 'Assignments', icon: ClipboardList, path: '/assignments' },
  { id: 'quiz-results', label: 'Quizzes', icon: Award, path: '/quiz-results' },
  { id: 'certificates', label: 'Certificates', icon: FileBadge, path: '/certificates' },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays, path: '/calendar' },
  { id: 'discussions', label: 'Discussions', icon: MessageSquare, path: '/discussions' },
  { id: 'wishlist', label: 'Wishlist', icon: Heart, path: '/wishlist' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' }
];

export const instructorNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'courses', label: 'My Courses', icon: FolderKanban, path: '/courses' },
  { id: 'course-builder', label: 'Course Builder', icon: LibraryBig, path: '/course-builder' },
  { id: 'assignments', label: 'Assignments', icon: ClipboardList, path: '/assignments' },
  { id: 'quiz-bank', label: 'Quiz Bank', icon: ListChecks, path: '/quiz-bank' },
  { id: 'submissions', label: 'Submissions', icon: ClipboardCheck, path: '/submissions' },
  { id: 'students', label: 'Students', icon: Users, path: '/students' },
  { id: 'discussions', label: 'Discussions', icon: MessageSquare, path: '/discussions' },
  { id: 'announcements', label: 'Announcements', icon: Bell, path: '/announcements' },
  { id: 'analytics', label: 'Analytics', icon: AreaChartIcon, path: '/analytics' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' }
];

export const adminNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'users', label: 'Users', icon: Users, path: '/users' },
  { id: 'courses', label: 'Courses', icon: LibraryBig, path: '/courses' },
  { id: 'categories', label: 'Categories', icon: FolderKanban, path: '/categories' },
  { id: 'enrollments', label: 'Enrollments', icon: ClipboardCheck, path: '/enrollments' },
  { id: 'reports', label: 'Reports', icon: Activity, path: '/reports' },
  { id: 'roles', label: 'Roles & Permissions', icon: ShieldCheck, path: '/roles' },
  { id: 'announcements', label: 'Announcements', icon: Bell, path: '/announcements' },
  { id: 'reviews', label: 'Reviews', icon: Star, path: '/reviews' },
  { id: 'audit-logs', label: 'Audit Logs', icon: Activity, path: '/audit-logs' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' }
];
