import type { Role, UserProfile } from '../types';

export const roleProfiles: Record<Role, UserProfile> = {
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

export const notifications = [
  { id: 1, title: 'New enrollment', body: 'Dewi joined Modern React Development.', time: '5m' },
  { id: 2, title: 'Quiz submitted', body: 'Marcus completed Node Architecture Check.', time: '22m' },
  { id: 3, title: 'Course review', body: 'UI/UX Design is ready for publishing review.', time: '1h' }
];
