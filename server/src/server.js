import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Kết nối database
  await connectDB();

  // Khởi động server
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`📡 API Health Check: http://localhost:${PORT}/api/v1/health`);
    console.log(`⚙️  Môi trường: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=========================================`);
  });
};

startServer();
