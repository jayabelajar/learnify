import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Lesson from '../models/Lesson.js';
import Module from '../models/Module.js';
import QuizAttempt from '../models/QuizAttempt.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const instructorDashboard = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id });
  const courseIds = courses.map((course) => course._id);
  const enrollments = await Enrollment.find({ course: { $in: courseIds } }).populate('student', 'name email avatar');
  const attempts = await QuizAttempt.find({}).populate('quiz', 'course title');
  const ownedAttempts = attempts.filter((attempt) => courseIds.some((id) => id.toString() === attempt.quiz?.course?.toString()));
  const publishedCourses = courses.filter((course) => course.status === 'published').length;
  const avgCompletion = enrollments.length
    ? Math.round(enrollments.reduce((sum, item) => sum + item.progress, 0) / enrollments.length)
    : 0;

  const courseTable = await Promise.all(
    courses.map(async (course) => {
      const modules = await Module.find({ course: course._id });
      const lessons = await Lesson.countDocuments({ module: { $in: modules.map((mod) => mod._id) } });
      const courseEnrollments = enrollments.filter((item) => item.course.toString() === course._id.toString());
      const completionRate = courseEnrollments.length
        ? Math.round(courseEnrollments.reduce((sum, item) => sum + item.progress, 0) / courseEnrollments.length)
        : 0;
      return { course, students: courseEnrollments.length, lessons, completionRate };
    })
  );

  res.json({
    kpis: {
      totalCourses: courses.length,
      publishedCourses,
      totalStudents: new Set(enrollments.map((item) => item.student._id.toString())).size,
      averageCompletionRate: avgCompletion
    },
    courseTable,
    quizAttempts: ownedAttempts
  });
});

export const courseStudents = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course || course.instructor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Forbidden');
  }
  const enrollments = await Enrollment.find({ course: course._id }).populate('student', 'name email avatar');
  res.json(enrollments);
});

export const courseAnalytics = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course || course.instructor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Forbidden');
  }
  const enrollments = await Enrollment.find({ course: course._id });
  const completed = enrollments.filter((item) => item.status === 'completed').length;
  res.json({
    enrollments: enrollments.length,
    completed,
    completionRate: enrollments.length ? Math.round((completed / enrollments.length) * 100) : 0,
    averageProgress: enrollments.length ? Math.round(enrollments.reduce((sum, item) => sum + item.progress, 0) / enrollments.length) : 0
  });
});
