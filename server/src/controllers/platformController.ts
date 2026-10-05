import Announcement from '../models/Announcement.js';
import Assignment from '../models/Assignment.js';
import AuditLog from '../models/AuditLog.js';
import Category from '../models/Category.js';
import Certificate from '../models/Certificate.js';
import Course from '../models/Course.js';
import DiscussionThread from '../models/DiscussionThread.js';
import Enrollment from '../models/Enrollment.js';
import Review from '../models/Review.js';
import Submission from '../models/Submission.js';
import { asyncHandler } from '../utils/asyncHandler.js';

async function instructorCourseIds(userId) {
  const courses = await Course.find({ instructor: userId }).select('_id');
  return courses.map((course) => course._id);
}

async function enrolledCourseIds(userId) {
  const enrollments = await Enrollment.find({ student: userId }).select('course');
  return enrollments.map((item) => item.course);
}

async function writeAudit(req, action: string, entity: string, metadata = {}) {
  if (!req.user?._id) return;
  await AuditLog.create({ actor: req.user._id, action, entity, metadata });
}

export const listCategories = asyncHandler(async (_req, res) => {
  res.json(await Category.find().sort('name'));
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  await writeAudit(req, 'create', 'Category', { id: category._id, name: category.name });
  res.status(201).json(category);
});

export const listAssignments = asyncHandler(async (req, res) => {
  const filter: Record<string, unknown> = {};
  if (req.user.role === 'instructor') filter.course = { $in: await instructorCourseIds(req.user._id) };
  if (req.user.role === 'student') filter.course = { $in: await enrolledCourseIds(req.user._id) };
  const assignments = await Assignment.find(filter).populate('course', 'title category instructor').sort('-createdAt');
  res.json(assignments);
});

export const createAssignment = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.body.course);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only create assignments for your own courses');
  }
  const assignment = await Assignment.create(req.body);
  await writeAudit(req, 'create', 'Assignment', { id: assignment._id, course: assignment.course });
  res.status(201).json(assignment);
});

export const listSubmissions = asyncHandler(async (req, res) => {
  let filter: Record<string, unknown> = {};
  if (req.user.role === 'student') filter = { student: req.user._id };
  if (req.user.role === 'instructor') {
    const assignments = await Assignment.find({ course: { $in: await instructorCourseIds(req.user._id) } }).select('_id');
    filter = { assignment: { $in: assignments.map((item) => item._id) } };
  }
  const submissions = await Submission.find(filter)
    .populate('student', 'name email avatar')
    .populate({ path: 'assignment', populate: { path: 'course', select: 'title' } })
    .sort('-createdAt');
  res.json(submissions);
});

export const createSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.create({ ...req.body, student: req.user._id });
  await writeAudit(req, 'submit', 'Submission', { id: submission._id, assignment: submission.assignment });
  res.status(201).json(submission);
});

export const reviewSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id);
  if (!submission) {
    res.status(404);
    throw new Error('Submission not found');
  }
  Object.assign(submission, req.body, { status: 'reviewed' });
  await submission.save();
  await writeAudit(req, 'review', 'Submission', { id: submission._id, grade: submission.grade });
  res.json(submission);
});

export const listCertificates = asyncHandler(async (req, res) => {
  const filter: Record<string, unknown> = {};
  if (req.user.role === 'student') filter.student = req.user._id;
  const certificates = await Certificate.find(filter).populate('student', 'name email').populate('course', 'title category').sort('-issuedAt');
  res.json(certificates);
});

export const createCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.create({
    ...req.body,
    certificateId: req.body.certificateId || `LRN-${Date.now().toString(36).toUpperCase()}`
  });
  await writeAudit(req, 'issue', 'Certificate', { id: certificate._id, course: certificate.course });
  res.status(201).json(certificate);
});

export const listDiscussions = asyncHandler(async (req, res) => {
  const filter: Record<string, unknown> = {};
  if (req.user.role === 'student') filter.course = { $in: await enrolledCourseIds(req.user._id) };
  if (req.user.role === 'instructor') filter.course = { $in: await instructorCourseIds(req.user._id) };
  const discussions = await DiscussionThread.find(filter).populate('author', 'name avatar role').populate('course', 'title').sort('-updatedAt');
  res.json(discussions);
});

export const createDiscussion = asyncHandler(async (req, res) => {
  const discussion = await DiscussionThread.create({ ...req.body, author: req.user._id });
  await writeAudit(req, 'create', 'DiscussionThread', { id: discussion._id, course: discussion.course });
  res.status(201).json(discussion);
});

export const listAnnouncements = asyncHandler(async (req, res) => {
  const filter: Record<string, unknown> = {};
  if (req.user.role !== 'admin') filter.audience = { $in: ['all', req.user.role] };
  const announcements = await Announcement.find(filter).populate('course', 'title').sort('-publishedAt');
  res.json(announcements);
});

export const createAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.create(req.body);
  await writeAudit(req, 'publish', 'Announcement', { id: announcement._id, audience: announcement.audience });
  res.status(201).json(announcement);
});

export const listReviews = asyncHandler(async (_req, res) => {
  const reviews = await Review.find().populate('student', 'name avatar').populate('course', 'title').sort('-createdAt');
  res.json(reviews);
});

export const createReview = asyncHandler(async (req, res) => {
  const review = await Review.create({ ...req.body, student: req.user._id });
  await writeAudit(req, 'create', 'Review', { id: review._id, course: review.course, rating: review.rating });
  res.status(201).json(review);
});

export const listAuditLogs = asyncHandler(async (_req, res) => {
  res.json(await AuditLog.find().populate('actor', 'name email role').sort('-createdAt').limit(100));
});
