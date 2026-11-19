import express from 'express';
import authRoutes from './authRoutes.js';
import courseRoutes from './courseRoutes.js';
import roadmapRoutes from './roadmapRoutes.js';
import articleRoutes from './articleRoutes.js';
import enrollmentRoutes from './enrollmentRoutes.js';
import orderRoutes from './orderRoutes.js';
import notificationRoutes from './notificationRoutes.js';

const router = express.Router();

// Kiểm tra API
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Backend API đang hoạt động bình thường!',
    timestamp: new Date().toISOString(),
  });
});

// Đăng ký các tuyến đường chính
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/roadmaps', roadmapRoutes);
router.use('/articles', articleRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/orders', orderRoutes);
router.use('/notifications', notificationRoutes);

export default router;
