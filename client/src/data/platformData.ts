export const platformFallback = {
  categories: [
    { id: 'cat-1', name: 'Web Development', description: 'Frontend, backend, and fullstack engineering tracks.', status: 'active' },
    { id: 'cat-2', name: 'Data Science', description: 'Analytics, Python, visualization, and machine learning basics.', status: 'active' },
    { id: 'cat-3', name: 'UI/UX Design', description: 'Product design, research, prototyping, and design systems.', status: 'active' }
  ],
  assignments: [
    { id: 'asg-1', title: 'Build a React Course Dashboard', courseTitle: 'Modern React Development', dueDate: '2026-10-12', status: 'published', points: 100 },
    { id: 'asg-2', title: 'Design API Authentication Flow', courseTitle: 'Node.js & Express API Masterclass', dueDate: '2026-10-18', status: 'published', points: 100 },
    { id: 'asg-3', title: 'Figma Component Audit', courseTitle: 'Advanced UI/UX Design Systems', dueDate: '2026-10-22', status: 'draft', points: 80 }
  ],
  submissions: [
    { id: 'sub-1', studentName: 'Alya Putri', assignmentTitle: 'Build a React Course Dashboard', courseTitle: 'Modern React Development', status: 'reviewed', grade: 92 },
    { id: 'sub-2', studentName: 'Raka Pratama', assignmentTitle: 'Design API Authentication Flow', courseTitle: 'Node.js & Express API Masterclass', status: 'submitted', grade: '-' },
    { id: 'sub-3', studentName: 'Maya Sari', assignmentTitle: 'Figma Component Audit', courseTitle: 'Advanced UI/UX Design Systems', status: 'returned', grade: 78 }
  ],
  certificates: [
    { id: 'cert-1', certificateId: 'LRN-REACT-1021', studentName: 'Alya Putri', courseTitle: 'Modern React Development', issuedAt: '2026-09-28', status: 'issued' },
    { id: 'cert-2', certificateId: 'LRN-DESIGN-1182', studentName: 'Maya Sari', courseTitle: 'Advanced UI/UX Design Systems', issuedAt: '2026-09-30', status: 'issued' }
  ],
  discussions: [
    { id: 'dis-1', title: 'How should I structure reusable components?', courseTitle: 'Modern React Development', authorName: 'Alya Putri', replies: 8, status: 'open' },
    { id: 'dis-2', title: 'JWT refresh token best practice', courseTitle: 'Node.js & Express API Masterclass', authorName: 'Raka Pratama', replies: 5, status: 'open' }
  ],
  announcements: [
    { id: 'ann-1', title: 'New assignment deadline posted', audience: 'student', status: 'published', publishedAt: '2026-10-04' },
    { id: 'ann-2', title: 'Instructor analytics refresh is live', audience: 'instructor', status: 'published', publishedAt: '2026-10-03' }
  ],
  reviews: [
    { id: 'rev-1', courseTitle: 'Modern React Development', studentName: 'Alya Putri', rating: 5, status: 'visible' },
    { id: 'rev-2', courseTitle: 'Node.js & Express API Masterclass', studentName: 'Raka Pratama', rating: 4, status: 'visible' }
  ],
  auditLogs: [
    { id: 'log-1', actorName: 'Admin User', action: 'publish', entity: 'Announcement', createdAt: '2026-10-04 09:40' },
    { id: 'log-2', actorName: 'Nadia Instructor', action: 'create', entity: 'Assignment', createdAt: '2026-10-03 14:12' }
  ],
  enrollments: [
    { id: 'enr-1', studentName: 'Alya Putri', courseTitle: 'Modern React Development', progress: '75%', status: 'in_progress' },
    { id: 'enr-2', studentName: 'Raka Pratama', courseTitle: 'Node.js & Express API Masterclass', progress: '40%', status: 'in_progress' },
    { id: 'enr-3', studentName: 'Maya Sari', courseTitle: 'Advanced UI/UX Design Systems', progress: '100%', status: 'completed' }
  ],
  quizzes: [
    { id: 'quiz-1', title: 'React State & Hooks Quiz', courseTitle: 'Modern React Development', questions: 12, passingScore: '75%', status: 'published' },
    { id: 'quiz-2', title: 'REST API Security Quiz', courseTitle: 'Node.js & Express API Masterclass', questions: 15, passingScore: '80%', status: 'published' }
  ],
  wishlist: [
    { id: 'wish-1', title: 'Python & Data Analysis Bootcamp', category: 'Data Science', level: 'Beginner', price: 'Free preview' },
    { id: 'wish-2', title: 'Advanced UI/UX Design Systems', category: 'UI/UX Design', level: 'Intermediate', price: 'Enrolled soon' }
  ],
  calendar: [
    { id: 'cal-1', title: 'Assignment Due: React Dashboard', date: '2026-10-12', type: 'Assignment', status: 'upcoming' },
    { id: 'cal-2', title: 'Live Review: API Authentication', date: '2026-10-16', type: 'Session', status: 'scheduled' },
    { id: 'cal-3', title: 'Quiz Window: UX Research', date: '2026-10-20', type: 'Quiz', status: 'upcoming' }
  ],
  roles: [
    { id: 'role-1', name: 'Student', permissions: 'Enroll, learn, submit assignments, join discussions', users: 120 },
    { id: 'role-2', name: 'Instructor', permissions: 'Manage own courses, assignments, quizzes, submissions', users: 14 },
    { id: 'role-3', name: 'Admin', permissions: 'Manage platform, users, reports, settings', users: 2 }
  ]
};
