import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Middlewares chung
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Cho phép requests không có origin (như mobile apps hoặc curl/Postman) hoặc nằm trong danh sách allowed
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Mở rộng trong môi trường development để tránh lỗi CORS
    }
  },
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
