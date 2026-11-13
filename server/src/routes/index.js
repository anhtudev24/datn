import express from 'express';
import authRoutes from './authRoutes.js';

const router = express.Router();

// Kiểm tra sức khỏe API (Health check)
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Backend API đang hoạt động bình thường!',
    timestamp: new Date().toISOString(),
  });
});

// Các tuyến đường chính
router.use('/auth', authRoutes);

export default router;
