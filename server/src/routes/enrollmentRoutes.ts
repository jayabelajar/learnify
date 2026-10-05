import { Router } from 'express';
import { completeLesson, getEnrollment, listEnrollments, myCourses } from '../controllers/enrollmentController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/my-courses', protect, authorize('student'), myCourses);
router.get('/', protect, authorize('admin'), listEnrollments);
router.get('/:courseId', protect, authorize('student'), getEnrollment);
router.patch('/:courseId/lessons/:lessonId/complete', protect, authorize('student'), completeLesson);

export default router;
