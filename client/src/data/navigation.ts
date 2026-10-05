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
  { id: 'student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'explore', label: 'Explore Courses', icon: Compass },
  { id: 'my-learning', label: 'My Learning', icon: BookOpen },
  { id: 'quiz-results', label: 'Quiz Results', icon: Award },
  { id: 'profile', label: 'Profile', icon: User }
];

export const instructorNav: NavItem[] = [
  { id: 'instructor-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'course-mgmt', label: 'Courses', icon: FolderKanban },
  { id: 'content-builder', label: 'Course Content', icon: LibraryBig },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: AreaChartIcon },
  { id: 'profile', label: 'Profile', icon: User }
];

export const adminNav: NavItem[] = [
  { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'admin-users', label: 'Users', icon: Users },
  { id: 'admin-courses', label: 'Courses', icon: LibraryBig },
  { id: 'admin-reports', label: 'Reports', icon: Activity },
  { id: 'admin-settings', label: 'Settings', icon: Settings },
  { id: 'profile', label: 'Profile', icon: User }
];
