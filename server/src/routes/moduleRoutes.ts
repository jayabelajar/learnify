import { Router } from 'express';
import { deleteModule, updateModule } from '../controllers/moduleController.js';
import { createLesson, listLessons } from '../controllers/lessonController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.put('/:id', protect, authorize('instructor', 'admin'), updateModule);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteModule);
router.get('/:moduleId/lessons', listLessons);
router.post('/:moduleId/lessons', protect, authorize('instructor', 'admin'), createLesson);

export default router;
