import { Router } from 'express';
import {
  deleteQuiz,
  getAttempt,
  getQuiz,
  quizAttempts,
  startQuiz,
  submitQuiz,
  updateQuiz
} from '../controllers/quizController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/attempts/:id', protect, getAttempt);
router.get('/:id', protect, getQuiz);
router.put('/:id', protect, authorize('instructor'), updateQuiz);
router.delete('/:id', protect, authorize('instructor'), deleteQuiz);
router.post('/:id/start', protect, authorize('student'), startQuiz);
router.post('/:id/submit', protect, authorize('student'), submitQuiz);
router.get('/:id/attempts', protect, authorize('instructor'), quizAttempts);

export default router;
