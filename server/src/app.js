import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Middlewares chung
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gốc API
app.get('/', (req, res) => {
  res.json({
    name: 'Backend API - Đồ Án Tốt Nghiệp',
    version: '1.0.0',
    documentation: '/api/v1/health',
  });
});

// Đăng ký toàn bộ API endpoints dưới tiền tố /api/v1
app.use('/api/v1', routes);

// Middleware xử lý lỗi (luôn đặt ở cuối cùng)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
