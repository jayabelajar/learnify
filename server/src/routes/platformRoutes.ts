import { Router } from 'express';
import {
  createAnnouncement,
  createAssignment,
  createCategory,
  createCertificate,
  createDiscussion,
  createReview,
  createSubmission,
  deleteAnnouncement,
  deleteAssignment,
  deleteAuditLog,
  deleteCategory,
  listAnnouncements,
  listAssignments,
  listAuditLogs,
  listCategories,
  listCertificates,
  listDiscussions,
  listReviews,
  listSubmissions,
  moderateReview,
  reviewSubmission,
  updateAnnouncement,
  updateAssignment,
  updateCategory
} from '../controllers/platformController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/categories', listCategories);
router.post('/categories', protect, authorize('admin'), createCategory);
router.put('/categories/:id', protect, authorize('admin'), updateCategory);
router.delete('/categories/:id', protect, authorize('admin'), deleteCategory);

router.get('/assignments', protect, listAssignments);
router.post('/assignments', protect, authorize('instructor', 'admin'), createAssignment);
router.put('/assignments/:id', protect, authorize('instructor', 'admin'), updateAssignment);
router.delete('/assignments/:id', protect, authorize('instructor', 'admin'), deleteAssignment);

router.get('/submissions', protect, listSubmissions);
router.post('/submissions', protect, authorize('student'), createSubmission);
router.patch('/submissions/:id/review', protect, authorize('instructor', 'admin'), reviewSubmission);

router.get('/certificates', protect, listCertificates);
router.post('/certificates', protect, authorize('instructor', 'admin'), createCertificate);

router.get('/discussions', protect, listDiscussions);
router.post('/discussions', protect, createDiscussion);

router.get('/announcements', protect, listAnnouncements);
router.post('/announcements', protect, authorize('instructor', 'admin'), createAnnouncement);
router.put('/announcements/:id', protect, authorize('instructor', 'admin'), updateAnnouncement);
router.delete('/announcements/:id', protect, authorize('instructor', 'admin'), deleteAnnouncement);

router.get('/reviews', protect, authorize('admin'), listReviews);
router.post('/reviews', protect, authorize('student'), createReview);
router.patch('/reviews/:id/moderate', protect, authorize('admin'), moderateReview);

router.get('/audit-logs', protect, authorize('admin'), listAuditLogs);
router.delete('/audit-logs/:id', protect, authorize('admin'), deleteAuditLog);

export default router;
