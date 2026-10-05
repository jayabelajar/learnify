import Enrollment from '../models/Enrollment.js';
import { recomputeEnrollmentProgress } from '../services/enrollmentService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const enrollCourse = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: req.params.courseId
  });
  res.status(201).json(enrollment);
});

export const myCourses = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({ path: 'course', populate: { path: 'instructor', select: 'name email avatar' } })
    .sort('-createdAt');
  res.json(enrollments);
});

export const listEnrollments = asyncHandler(async (_req, res) => {
  const enrollments = await Enrollment.find()
    .populate('student', 'name email avatar')
    .populate({ path: 'course', populate: { path: 'instructor', select: 'name email avatar' } })
    .sort('-createdAt');
  res.json(enrollments);
});

export const getEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findOne({ student: req.user._id, course: req.params.courseId }).populate('course');
  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found');
  }
  res.json(enrollment);
});

export const completeLesson = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findOne({ student: req.user._id, course: req.params.courseId });
  if (!enrollment) {
    res.status(403);
    throw new Error('Enroll before accessing lessons');
  }
  const exists = enrollment.completedLessons.some((lessonId) => lessonId.toString() === req.params.lessonId);
  if (!exists) enrollment.completedLessons.push(req.params.lessonId);
  const updated = await recomputeEnrollmentProgress(enrollment);
  res.json(updated);
});
