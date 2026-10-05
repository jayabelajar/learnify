import { Router } from 'express';
import { deleteLesson, getLesson, updateLesson } from '../controllers/lessonController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/:id', protect, getLesson);
router.put('/:id', protect, authorize('instructor', 'admin'), updateLesson);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteLesson);

export default router;
