import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import { gradeQuizAttempt, sanitizeQuiz } from '../services/quizService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

async function assertCourseOwner(courseId, userId) {
  const course = await Course.findById(courseId);
  if (!course) throw new Error('Course not found');
  if (course.instructor.toString() !== userId.toString()) {
    const error = new Error('You can only manage quizzes for your own course');
    error.statusCode = 403;
    throw error;
  }
  return course;
}

export const createQuiz = asyncHandler(async (req, res) => {
  await assertCourseOwner(req.params.courseId, req.user._id);
  const quiz = await Quiz.create({ ...req.body, course: req.params.courseId });
  res.status(201).json(quiz);
});

export const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }
  if (req.user.role === 'student') return res.json(sanitizeQuiz(quiz));
  await assertCourseOwner(quiz.course, req.user._id);
  res.json(quiz);
});

export const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }
  await assertCourseOwner(quiz.course, req.user._id);
  Object.assign(quiz, req.body);
  await quiz.save();
  res.json(quiz);
});

export const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }
  await assertCourseOwner(quiz.course, req.user._id);
  await QuizAttempt.deleteMany({ quiz: quiz._id });
  await quiz.deleteOne();
  res.json({ message: 'Quiz deleted' });
});

export const startQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  const enrolled = await Enrollment.exists({ student: req.user._id, course: quiz.course });
  if (!enrolled) {
    res.status(403);
    throw new Error('Enroll before starting quiz');
  }
  const attempt = await QuizAttempt.create({ quiz: quiz._id, student: req.user._id });
  res.status(201).json({ attempt, quiz: sanitizeQuiz(quiz) });
});

export const submitQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  const result = gradeQuizAttempt(quiz, req.body.answers || []);
  const attempt = await QuizAttempt.create({
    quiz: quiz._id,
    student: req.user._id,
    ...result,
    submittedAt: new Date()
  });

  res.status(201).json({ attempt, passingScore: quiz.passingScore });
});

export const getAttempt = asyncHandler(async (req, res) => {
  const attempt = await QuizAttempt.findById(req.params.id).populate('quiz', 'title passingScore');
  if (!attempt) {
    res.status(404);
    throw new Error('Attempt not found');
  }
  if (attempt.student.toString() !== req.user._id.toString() && req.user.role !== 'instructor') {
    res.status(403);
    throw new Error('Forbidden');
  }
  res.json(attempt);
});

export const quizAttempts = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  await assertCourseOwner(quiz.course, req.user._id);
  const attempts = await QuizAttempt.find({ quiz: quiz._id }).populate('student', 'name email avatar');
  res.json(attempts);
});
