import Enrollment from '../models/Enrollment.js';
import Lesson from '../models/Lesson.js';
import Module from '../models/Module.js';
import { asyncHandler } from '../utils/asyncHandler.js';

async function recomputeProgress(enrollment) {
  const modules = await Module.find({ course: enrollment.course }).select('_id');
  const totalLessons = await Lesson.countDocuments({ module: { $in: modules.map((mod) => mod._id) } });
  const completed = enrollment.completedLessons.length;
  enrollment.progress = totalLessons ? Math.round((completed / totalLessons) * 100) : 0;
  enrollment.status = enrollment.progress === 100 ? 'completed' : enrollment.progress > 0 ? 'in_progress' : 'not_started';
  enrollment.completedAt = enrollment.progress === 100 ? new Date() : undefined;
  await enrollment.save();
  return enrollment;
}

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
  const updated = await recomputeProgress(enrollment);
  res.json(updated);
});
