import {
  Activity,
  AreaChart as AreaChartIcon,
  Award,
  BookOpen,
  Compass,
  FolderKanban,
  LayoutDashboard,
  LibraryBig,
  Settings,
  User,
  Users
} from 'lucide-react';
import type { NavItem } from '../types';

export const studentNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'explore-courses', label: 'Explore Courses', icon: Compass, path: '/explore-courses' },
  { id: 'my-learning', label: 'My Learning', icon: BookOpen, path: '/my-learning' },
  { id: 'quiz-results', label: 'Quiz Results', icon: Award, path: '/quiz-results' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' }
];

export const instructorNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'courses', label: 'Courses', icon: FolderKanban, path: '/courses' },
  { id: 'course-builder', label: 'Course Builder', icon: LibraryBig, path: '/course-builder' },
  { id: 'students', label: 'Students', icon: Users, path: '/students' },
  { id: 'analytics', label: 'Analytics', icon: AreaChartIcon, path: '/analytics' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' }
];

export const adminNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'users', label: 'Users', icon: Users, path: '/users' },
  { id: 'courses', label: 'Courses', icon: LibraryBig, path: '/courses' },
  { id: 'reports', label: 'Reports', icon: Activity, path: '/reports' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' }
];
