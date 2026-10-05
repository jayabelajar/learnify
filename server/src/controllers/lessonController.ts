import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Module from '../models/Module.js';
import { asyncHandler } from '../utils/asyncHandler.js';

async function assertModuleOwner(moduleId, user) {
  const moduleDoc = await Module.findById(moduleId);
  if (!moduleDoc) throw new Error('Module not found');
  const course = await Course.findById(moduleDoc.course);
  if (user.role !== 'admin' && course.instructor.toString() !== user._id.toString()) {
    const error = new Error('You can only manage lessons in your own courses');
    error.statusCode = 403;
    throw error;
  }
  return moduleDoc;
}

export const listLessons = asyncHandler(async (req, res) => {
  const lessons = await Lesson.find({ module: req.params.moduleId }).sort('order');
  res.json(lessons);
});

export const createLesson = asyncHandler(async (req, res) => {
  await assertModuleOwner(req.params.moduleId, req.user);
  const lesson = await Lesson.create({ ...req.body, module: req.params.moduleId });
  res.status(201).json(lesson);
});

export const getLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }
  res.json(lesson);
});

export const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }
  await assertModuleOwner(lesson.module, req.user);
  Object.assign(lesson, req.body);
  await lesson.save();
  res.json(lesson);
});

export const deleteLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }
  await assertModuleOwner(lesson.module, req.user);
  await lesson.deleteOne();
  res.json({ message: 'Lesson deleted' });
});
