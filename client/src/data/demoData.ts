export const demoUser = {
  name: 'Alex Rivera',
  email: 'alex.rivera@learnify.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'
};

export const seedCourses = [
  {
    id: 'react-fundamentals',
    title: 'Modern React Development',
    category: 'Web Dev',
    level: 'Intermediate',
    instructor: 'Sarah Drasner',
    rating: 4.9,
    status: 'published',
    studentsCount: 420,
    completionRate: 82,
    progress: 75,
    isEnrolled: true,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=900&auto=format&fit=crop&q=80',
    description: 'Master component-driven architecture, hooks, routing, and scalable clean code patterns.',
    modules: [
      {
        id: 'm-react-1',
        title: 'Introduction and Setup',
        lessons: [
          { id: 'l-react-1', title: 'What is React?', type: 'video', duration: 10, completed: true, description: 'Understand declarative UI and the virtual DOM.', videoUrl: 'https://www.youtube.com/embed/Tn6-PIqc4UM' },
          { id: 'l-react-2', title: 'Setup Environment with Vite', type: 'article', duration: 12, completed: true, description: 'Prepare tooling, linting, and project structure.', content: 'Install Node.js, create a Vite React project, then separate components, pages, hooks, and services early. Keep the first milestone small: a running app, clean scripts, and a predictable folder structure.' }
        ],
      },
      {
        id: 'm-react-2',
        title: 'Components and State',
        lessons: [
          { id: 'l-react-3', title: 'Components and JSX Structure', type: 'video', duration: 14, completed: true, description: 'Build reusable UI blocks with props.', videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk' },
          { id: 'l-react-4', title: 'Props and State Management', type: 'article', duration: 18, completed: false, description: 'Apply one-way data flow in real interfaces.', content: 'Start state as close as possible to where it is used. Lift it only when siblings need to coordinate. Prefer derived values over duplicated state so the UI stays consistent.' },
          {
            id: 'l-react-5',
            title: 'React Basics Quiz',
            type: 'quiz',
            duration: 8,
            completed: false,
            description: 'Check your understanding before moving to the project task.',
            quiz: {
          id: 'q-react-1',
          title: 'React Basics Quiz',
          passingScore: 70,
          questions: [
            { id: 'rq1', question: 'What is the virtual DOM?', options: ['A lightweight representation of the DOM', 'A database index', 'A CSS compiler', 'A browser extension'], correctAnswer: 0 },
            { id: 'rq2', question: 'Which hook stores component state?', options: ['useMemo', 'useState', 'useLink', 'useRoute'], correctAnswer: 1 }
          ]
            }
          },
          { id: 'l-react-6', title: 'Build a Profile Card', type: 'submission', duration: 25, completed: false, description: 'Submit a reusable React component with props.', submissionInstructions: 'Create a ProfileCard component with avatar, name, role, and two stat items. Submit a GitHub repository link or ZIP file.' }
        ]
      }
    ]
  },
  {
    id: 'node-express',
    title: 'Node.js and Express Masterclass',
    category: 'Backend',
    level: 'Advanced',
    instructor: 'Ryan Dahl',
    rating: 4.8,
    status: 'published',
    studentsCount: 310,
    completionRate: 65,
    progress: 33,
    isEnrolled: true,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80',
    description: 'Build REST APIs with authentication, validation, middleware, and MongoDB persistence.',
    modules: [
      {
        id: 'm-node-1',
        title: 'API Foundations',
        lessons: [
          { id: 'l-node-1', title: 'Event Loop and Non-blocking I/O', type: 'video', duration: 15, completed: true, description: 'Learn how Node handles concurrency.', videoUrl: 'https://www.youtube.com/embed/8aGhZQkoFbQ' },
          { id: 'l-node-2', title: 'Express Middleware Pipeline', type: 'article', duration: 11, completed: false, description: 'Compose request lifecycle handlers.', content: 'Middleware should do one job well: authenticate, validate, transform, or handle errors. Keep route handlers slim by moving reusable request lifecycle logic into middleware.' },
          { id: 'l-node-3', title: 'Design an Auth Endpoint', type: 'submission', duration: 30, completed: false, description: 'Submit a small Express authentication flow.', submissionInstructions: 'Build login and register endpoints with validation, hashed passwords, JWT response, and role-aware authorization middleware.' }
        ]
      }
    ]
  },
  {
    id: 'python-data',
    title: 'Python for Data Analysis',
    category: 'Data Science',
    level: 'Beginner',
    instructor: 'Maya Patel',
    rating: 4.7,
    status: 'published',
    studentsCount: 510,
    completionRate: 90,
    progress: 100,
    isEnrolled: true,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&auto=format&fit=crop&q=80',
    description: 'Use Pandas, NumPy, and charts to explore and communicate dataset insights.',
    modules: []
  },
  {
    id: 'uiux-fundamentals',
    title: 'UI/UX Design Fundamentals',
    category: 'Design',
    level: 'Beginner',
    instructor: 'Steve Schoger',
    rating: 4.9,
    status: 'draft',
    studentsCount: 180,
    completionRate: 50,
    progress: 0,
    isEnrolled: false,
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=900&auto=format&fit=crop&q=80',
    description: 'Learn visual hierarchy, typography, layout systems, and practical prototyping.',
    modules: []
  }
];

export const seedQuizResults = [
  { id: 1, quizTitle: 'React Basics Quiz', courseTitle: 'Modern React Development', score: 90, passed: true, date: 'Oct 02, 2026' },
  { id: 2, quizTitle: 'Node Architecture Check', courseTitle: 'Node.js and Express Masterclass', score: 85, passed: true, date: 'Sep 28, 2026' }
];

export const seedStudents = [
  { id: 1, name: 'Jessica Taylor', email: 'jessica@dev.com', course: 'Modern React Development', date: 'Oct 01, 2026', progress: 80, quizAvg: 92, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Marcus Chen', email: 'marcus@code.org', course: 'Node.js and Express Masterclass', date: 'Sep 25, 2026', progress: 45, quizAvg: 84, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Dewi Lestari', email: 'dewi@student.id', course: 'Python for Data Analysis', date: 'Sep 18, 2026', progress: 100, quizAvg: 96, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80' }
];
