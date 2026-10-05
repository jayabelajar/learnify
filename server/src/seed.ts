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
