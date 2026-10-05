import { Router } from 'express';
import {
  createAnnouncement,
  createAssignment,
  createCategory,
  createCertificate,
  createDiscussion,
  createReview,
  createSubmission,
  listAnnouncements,
  listAssignments,
  listAuditLogs,
  listCategories,
  listCertificates,
  listDiscussions,
  listReviews,
  listSubmissions,
  reviewSubmission
} from '../controllers/platformController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/categories', listCategories);
router.post('/categories', protect, authorize('admin'), createCategory);

router.get('/assignments', protect, listAssignments);
router.post('/assignments', protect, authorize('instructor', 'admin'), createAssignment);

router.get('/submissions', protect, listSubmissions);
router.post('/submissions', protect, authorize('student'), createSubmission);
router.patch('/submissions/:id/review', protect, authorize('instructor', 'admin'), reviewSubmission);

router.get('/certificates', protect, listCertificates);
router.post('/certificates', protect, authorize('instructor', 'admin'), createCertificate);

router.get('/discussions', protect, listDiscussions);
router.post('/discussions', protect, createDiscussion);

router.get('/announcements', protect, listAnnouncements);
router.post('/announcements', protect, authorize('instructor', 'admin'), createAnnouncement);

router.get('/reviews', protect, authorize('admin'), listReviews);
router.post('/reviews', protect, authorize('student'), createReview);

router.get('/audit-logs', protect, authorize('admin'), listAuditLogs);

export default router;
