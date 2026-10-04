import { Router } from 'express';
import {
  courseAnalytics,
  courseStudents,
  instructorDashboard
} from '../controllers/analyticsController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/dashboard', protect, authorize('instructor'), instructorDashboard);
router.get('/courses/:id/students', protect, authorize('instructor'), courseStudents);
router.get('/courses/:id/analytics', protect, authorize('instructor'), courseAnalytics);

export default router;
