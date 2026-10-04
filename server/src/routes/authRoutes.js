import { Router } from 'express';
import { body } from 'express-validator';
import { login, me, register } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['student', 'instructor'])
  ],
  register
);
router.post('/login', login);
router.get('/me', protect, me);

export default router;
