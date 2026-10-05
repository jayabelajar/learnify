import { Router } from 'express';
import {
  createCourse,
  deleteCourse,
  getCourse,
  listCourses,
  publishCourse,
  updateCourse
} from '../controllers/courseController.js';
import { createModule, listModules } from '../controllers/moduleController.js';
import { enrollCourse } from '../controllers/enrollmentController.js';
import { createQuiz } from '../controllers/quizController.js';
import { authorize, optionalProtect, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalProtect, listCourses);
router.get('/:id', optionalProtect, getCourse);
router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);
router.patch('/:id/publish', protect, authorize('instructor', 'admin'), publishCourse);
router.get('/:courseId/modules', listModules);
router.post('/:courseId/modules', protect, authorize('instructor', 'admin'), createModule);
router.post('/:courseId/enroll', protect, authorize('student'), enrollCourse);
router.post('/:courseId/quizzes', protect, authorize('instructor', 'admin'), createQuiz);

export default router;
