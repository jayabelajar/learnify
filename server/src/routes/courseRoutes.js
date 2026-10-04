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
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', listCourses);
router.get('/:id', getCourse);
router.post('/', protect, authorize('instructor'), createCourse);
router.put('/:id', protect, authorize('instructor'), updateCourse);
router.delete('/:id', protect, authorize('instructor'), deleteCourse);
router.patch('/:id/publish', protect, authorize('instructor'), publishCourse);
router.get('/:courseId/modules', listModules);
router.post('/:courseId/modules', protect, authorize('instructor'), createModule);
router.post('/:courseId/enroll', protect, authorize('student'), enrollCourse);
router.post('/:courseId/quizzes', protect, authorize('instructor'), createQuiz);

export default router;
