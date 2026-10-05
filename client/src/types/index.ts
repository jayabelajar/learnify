import type { LucideIcon } from 'lucide-react';

export type Role = 'student' | 'instructor' | 'admin';

export type UserProfile = {
  name: string;
  email: string;
  role: Role;
  avatar: string;
  password: string;
};

export type Lesson = {
  id: string;
  title: string;
  type: 'video' | 'text' | 'pdf';
  duration: number;
  completed: boolean;
  description: string;
};

export type Quiz = {
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

export type CourseModule = {
  id: string;
  title: string;
  lessons: Lesson[];
  quiz?: Quiz;
};

export type Course = {
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
  shortDescription?: string;
  modules: CourseModule[];
};

export type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export type SearchResult = {
  id: string;
  title: string;
  type: string;
  target: string;
};
