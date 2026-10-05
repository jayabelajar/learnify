import slugify from 'slugify';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Lesson from '../models/Lesson.js';
import Module from '../models/Module.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const makeSlug = (title) => `${slugify(title, { lower: true, strict: true })}-${Date.now().toString(36)}`;

async function assertOwner(courseId, user) {
  const course = await Course.findById(courseId);
  if (!course) {
    const error = new Error('Course not found');
    error.statusCode = 404;
    throw error;
  }
  if (user.role !== 'admin' && course.instructor.toString() !== user._id.toString()) {
    const error = new Error('You can only manage your own courses');
    error.statusCode = 403;
    throw error;
  }
  return course;
}

export const listCourses = asyncHandler(async (req, res) => {
  const { search = '', category, level, mine } = req.query;
  const filter: Record<string, unknown> = {};

  if (req.user?.role === 'admin') {
    // Admin sees all courses.
  } else if (req.user?.role === 'instructor' && mine === 'true') {
    filter.instructor = req.user._id;
  } else {
    filter.status = 'published';
  }

  if (category) filter.category = category;
  if (level) filter.level = level;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const courses = await Course.find(filter).populate('instructor', 'name email avatar').sort('-createdAt');
  res.json(courses);
});

export const getCourse = asyncHandler(async (req, res) => {
  const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: req.params.id }
    : { slug: req.params.id };
  const course = await Course.findOne(query).populate('instructor', 'name email avatar');
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  if (course.status !== 'published' && course.instructor._id.toString() !== req.user?._id?.toString()) {
    res.status(403);
    throw new Error('Draft course is private');
  }

  const modules = await Module.find({ course: course._id }).sort('order').lean();
  const moduleIds = modules.map((mod) => mod._id);
  const lessons = await Lesson.find({ module: { $in: moduleIds } }).sort('order').lean();
  const modulesWithLessons = modules.map((moduleDoc) => ({
    ...moduleDoc,
    lessons: lessons.filter((lesson) => lesson.module.toString() === moduleDoc._id.toString())
  }));
  const lessonCount = lessons.length;
  const studentsCount = await Enrollment.countDocuments({ course: course._id });
  res.json({ ...course.toObject(), modules: modulesWithLessons, lessons, lessonCount, studentsCount });
});

export const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create({
    ...req.body,
    slug: makeSlug(req.body.title),
    instructor: req.user._id,
    status: req.body.status || 'draft'
  });
  res.status(201).json(course);
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await assertOwner(req.params.id, req.user);
  Object.assign(course, req.body);
  if (req.body.title && req.body.title !== course.title) course.slug = makeSlug(req.body.title);
  await course.save();
  res.json(course);
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await assertOwner(req.params.id, req.user);
  const modules = await Module.find({ course: course._id });
  await Lesson.deleteMany({ module: { $in: modules.map((mod) => mod._id) } });
  await Module.deleteMany({ course: course._id });
  await Enrollment.deleteMany({ course: course._id });
  await course.deleteOne();
  res.json({ message: 'Course deleted' });
});

export const publishCourse = asyncHandler(async (req, res) => {
  const course = await assertOwner(req.params.id, req.user);
  course.status = course.status === 'published' ? 'draft' : 'published';
  await course.save();
  res.json(course);
});
