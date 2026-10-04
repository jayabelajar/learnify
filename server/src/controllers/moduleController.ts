import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Module from '../models/Module.js';
import { asyncHandler } from '../utils/asyncHandler.js';

async function ownedCourse(courseId, userId) {
  const course = await Course.findById(courseId);
  if (!course) throw new Error('Course not found');
  if (course.instructor.toString() !== userId.toString()) {
    const error = new Error('You can only manage your own course');
    error.statusCode = 403;
    throw error;
  }
  return course;
}

export const listModules = asyncHandler(async (req, res) => {
  const modules = await Module.find({ course: req.params.courseId }).sort('order');
  res.json(modules);
});

export const createModule = asyncHandler(async (req, res) => {
  await ownedCourse(req.params.courseId, req.user._id);
  const moduleDoc = await Module.create({ ...req.body, course: req.params.courseId });
  res.status(201).json(moduleDoc);
});

export const updateModule = asyncHandler(async (req, res) => {
  const moduleDoc = await Module.findById(req.params.id);
  if (!moduleDoc) {
    res.status(404);
    throw new Error('Module not found');
  }
  await ownedCourse(moduleDoc.course, req.user._id);
  Object.assign(moduleDoc, req.body);
  await moduleDoc.save();
  res.json(moduleDoc);
});

export const deleteModule = asyncHandler(async (req, res) => {
  const moduleDoc = await Module.findById(req.params.id);
  if (!moduleDoc) {
    res.status(404);
    throw new Error('Module not found');
  }
  await ownedCourse(moduleDoc.course, req.user._id);
  await Lesson.deleteMany({ module: moduleDoc._id });
  await moduleDoc.deleteOne();
  res.json({ message: 'Module deleted' });
});
