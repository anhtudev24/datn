import express from 'express';
import { getMyEnrollments, enrollCourse, updateProgress } from '../controllers/enrollmentController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getMyEnrollments);
router.post('/', authenticate, enrollCourse);
router.put('/progress', authenticate, updateProgress);

export default router;
