import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'node:dns';
import Course from './models/Course.js';
import Enrollment from './models/Enrollment.js';
import Lesson from './models/Lesson.js';
import Module from './models/Module.js';
import QuizAttempt from './models/QuizAttempt.js';
import Quiz from './models/Quiz.js';
import User from './models/User.js';
import Announcement from './models/Announcement.js';
import Assignment from './models/Assignment.js';
import AuditLog from './models/AuditLog.js';
import Category from './models/Category.js';
import Certificate from './models/Certificate.js';
import DiscussionThread from './models/DiscussionThread.js';
import Review from './models/Review.js';
import Submission from './models/Submission.js';

dotenv.config();

const avatars = {
  student: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
  instructor: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
  admin: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80'
};

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is required for seeding');

  if (process.env.MONGODB_DNS_SERVERS) {
    dns.setServers(process.env.MONGODB_DNS_SERVERS.split(',').map((server) => server.trim()));
  }

  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME || 'learnify' });

  await Promise.all([
    AuditLog.deleteMany({}),
    Review.deleteMany({}),
    Announcement.deleteMany({}),
    DiscussionThread.deleteMany({}),
    Certificate.deleteMany({}),
    Submission.deleteMany({}),
    Assignment.deleteMany({}),
    Category.deleteMany({}),
    QuizAttempt.deleteMany({}),
    Quiz.deleteMany({}),
    Enrollment.deleteMany({}),
    Lesson.deleteMany({}),
    Module.deleteMany({}),
    Course.deleteMany({}),
    User.deleteMany({})
  ]);

  const [student, instructor, admin] = await User.create([
    { name: 'Alex Rivera', email: 'student@learnify.io', password: 'password123', role: 'student', avatar: avatars.student },
    { name: 'Sarah Wijaya', email: 'instructor@learnify.io', password: 'password123', role: 'instructor', avatar: avatars.instructor },
    { name: 'Admin Learnify', email: 'admin@learnify.io', password: 'password123', role: 'admin', avatar: avatars.admin }
  ]);

  await Category.create([
    { name: 'Web Dev', description: 'Frontend, backend, and fullstack web development.' },
    { name: 'Backend', description: 'API, database, authentication, and server architecture.' },
    { name: 'Data Science', description: 'Python, analytics, visualization, and machine learning foundations.' },
    { name: 'UI/UX Design', description: 'Research, wireframing, prototyping, and design systems.' }
  ]);

  const reactCourse = await Course.create({
    title: 'Modern React Development',
    slug: 'modern-react-development',
    shortDescription: 'Build scalable React applications with modern patterns.',
    description: 'Master component-driven architecture, hooks, routing, and scalable clean code patterns.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=900&auto=format&fit=crop&q=80',
    category: 'Web Dev',
    level: 'Intermediate',
    instructor: instructor._id,
    status: 'published'
  });

  const reactIntro = await Module.create({ course: reactCourse._id, title: 'Introduction and Setup', order: 1 });
  const reactComponents = await Module.create({ course: reactCourse._id, title: 'Components and State', order: 2 });

  await Lesson.create([
    {
      module: reactIntro._id,
      title: 'What is React?',
      type: 'video',
      duration: 10,
      order: 1,
      description: 'Understand declarative UI and the virtual DOM.',
      videoUrl: 'https://www.youtube.com/embed/Tn6-PIqc4UM'
    },
    {
      module: reactIntro._id,
      title: 'Setup Environment with Vite',
      type: 'article',
      duration: 12,
      order: 2,
      description: 'Prepare tooling, linting, and project structure.',
      content: 'Install Node.js, create a Vite React project, then separate components, pages, hooks, and services early.'
    },
    {
      module: reactComponents._id,
      title: 'React Basics Quiz',
      type: 'quiz',
      duration: 8,
      order: 1,
      description: 'Check your understanding before moving to the project task.',
      quiz: {
        title: 'React Basics Quiz',
        passingScore: 70,
        questions: [
          { question: 'What is the virtual DOM?', options: ['A lightweight representation of the DOM', 'A database index', 'A CSS compiler', 'A browser extension'], correctAnswer: 0 },
          { question: 'Which hook stores component state?', options: ['useMemo', 'useState', 'useLink', 'useRoute'], correctAnswer: 1 }
        ]
      }
    },
    {
      module: reactComponents._id,
      title: 'Build a Profile Card',
      type: 'submission',
      duration: 25,
      order: 2,
      description: 'Submit a reusable React component with props.',
      submissionInstructions: 'Create a ProfileCard component with avatar, name, role, and two stat items. Submit a GitHub repository link or ZIP file.'
    }
  ]);

  const nodeCourse = await Course.create({
    title: 'Node.js and Express Masterclass',
    slug: 'node-express-masterclass',
    shortDescription: 'Design production-ready REST APIs.',
    description: 'Build REST APIs with authentication, validation, middleware, and MongoDB persistence.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80',
    category: 'Backend',
    level: 'Advanced',
    instructor: instructor._id,
    status: 'published'
  });

  const nodeModule = await Module.create({ course: nodeCourse._id, title: 'API Foundations', order: 1 });
  await Lesson.create([
    {
      module: nodeModule._id,
      title: 'Event Loop and Non-blocking I/O',
      type: 'video',
      duration: 15,
      order: 1,
      description: 'Learn how Node handles concurrency.',
      videoUrl: 'https://www.youtube.com/embed/8aGhZQkoFbQ'
    },
    {
      module: nodeModule._id,
      title: 'Express Middleware Pipeline',
      type: 'article',
      duration: 11,
      order: 2,
      description: 'Compose request lifecycle handlers.',
      content: 'Middleware should do one job well: authenticate, validate, transform, or handle errors.'
    }
  ]);

  await Enrollment.create({ student: student._id, course: reactCourse._id, progress: 50, status: 'in_progress' });
  await Enrollment.create({ student: student._id, course: nodeCourse._id, progress: 0, status: 'not_started' });

  const reactQuiz = await Quiz.create({
    course: reactCourse._id,
    module: reactComponents._id,
    title: 'React State and Hooks Quiz',
    description: 'Validate understanding of state, props, hooks, and component flow.',
    passingScore: 75,
    timeLimit: 20,
    questions: [
      { question: 'Which hook stores component state?', options: ['useEffect', 'useState', 'useMemo', 'useRef'], correctAnswer: 1, points: 1 },
      { question: 'Props are used to...', options: ['Pass data into components', 'Compile CSS', 'Run database queries', 'Deploy apps'], correctAnswer: 0, points: 1 },
      { question: 'useEffect commonly handles...', options: ['Side effects', 'Password hashing', 'HTTP status codes', 'Schema indexes'], correctAnswer: 0, points: 1 }
    ]
  });

  await Quiz.create({
    course: nodeCourse._id,
    module: nodeModule._id,
    title: 'REST API Security Quiz',
    description: 'Assess JWT, authorization, middleware, and validation concepts.',
    passingScore: 80,
    timeLimit: 25,
    questions: [
      { question: 'JWT is commonly used for...', options: ['Authentication', 'Image compression', 'CSS layout', 'DNS lookup'], correctAnswer: 0, points: 1 },
      { question: 'Authorization checks should happen...', options: ['On protected routes', 'Only in CSS', 'After deployment only', 'Inside package.json'], correctAnswer: 0, points: 1 }
    ]
  });

  const [reactAssignment, apiAssignment] = await Assignment.create([
    {
      course: reactCourse._id,
      title: 'Build a React Course Dashboard',
      instructions: 'Create a responsive dashboard with KPI cards, course rows, and progress bars. Submit a GitHub repository link.',
      dueDate: new Date('2026-10-12'),
      points: 100,
      status: 'published'
    },
    {
      course: nodeCourse._id,
      title: 'Design API Authentication Flow',
      instructions: 'Document and implement a JWT login flow with protected routes and role guards.',
      dueDate: new Date('2026-10-18'),
      points: 100,
      status: 'published'
    }
  ]);

  await Submission.create([
    {
      assignment: reactAssignment._id,
      student: student._id,
      content: 'https://github.com/demo/react-dashboard',
      grade: 92,
      feedback: 'Clean component structure and solid responsive behavior.',
      status: 'reviewed'
    },
    {
      assignment: apiAssignment._id,
      student: student._id,
      content: 'https://github.com/demo/api-auth-flow',
      status: 'submitted'
    }
  ]);

  await QuizAttempt.create({
    quiz: reactQuiz._id,
    student: student._id,
    answers: [
      { questionId: reactQuiz.questions[0]._id, answer: 1 },
      { questionId: reactQuiz.questions[1]._id, answer: 0 },
      { questionId: reactQuiz.questions[2]._id, answer: 0 }
    ],
    score: 100,
    correctAnswers: 3,
    incorrectAnswers: 0,
    passed: true,
    submittedAt: new Date()
  });

  await Certificate.create({
    certificateId: 'LRN-REACT-1021',
    student: student._id,
    course: reactCourse._id,
    status: 'issued'
  });

  await DiscussionThread.create([
    {
      course: reactCourse._id,
      title: 'How should I structure reusable components?',
      body: 'Should cards, badges, and tables live under common components?',
      author: student._id,
      replies: [{ author: instructor._id, body: 'Yes. Keep reusable primitives under common and domain components under course/student/instructor folders.' }]
    },
    {
      course: nodeCourse._id,
      title: 'JWT refresh token best practice',
      body: 'Where should refresh tokens be stored for a web app?',
      author: student._id,
      replies: [{ author: instructor._id, body: 'Use httpOnly cookies for refresh tokens and short-lived access tokens.' }]
    }
  ]);

  await Announcement.create([
    {
      title: 'New assignment deadline posted',
      body: 'React dashboard assignment is due on 12 Oct 2026.',
      audience: 'student',
      course: reactCourse._id
    },
    {
      title: 'Instructor analytics refresh is live',
      body: 'Course completion and student progress reports now refresh from the API.',
      audience: 'instructor'
    }
  ]);

  await Review.create([
    { course: reactCourse._id, student: student._id, rating: 5, comment: 'Great practical course with useful assignments.' },
    { course: nodeCourse._id, student: student._id, rating: 4, comment: 'The API examples are clear and production-oriented.' }
  ]);

  await AuditLog.create([
    { actor: admin._id, action: 'seed', entity: 'Database', metadata: { scope: 'fullstack course platform' } },
    { actor: instructor._id, action: 'create', entity: 'Assignment', metadata: { title: reactAssignment.title } },
    { actor: admin._id, action: 'publish', entity: 'Announcement', metadata: { title: 'New assignment deadline posted' } }
  ]);

  console.log('Seed complete');
  console.log('Student: student@learnify.io / password123');
  console.log('Instructor: instructor@learnify.io / password123');
  console.log('Admin: admin@learnify.io / password123');

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
