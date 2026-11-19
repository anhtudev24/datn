import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Khởi tạo MySQL Connection Pool với thông số cấu hình từ .env
 * - Host: localhost (hoặc 127.0.0.1)
 * - Port: 3060 (theo cấu hình MySQL Workbench của bạn)
 * - User: root
 * - Password: 1234
 * - Database: datn_learning_db
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'edusmart',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // Số kết nối nhàn rỗi tối đa
  idleTimeout: 60000, // Thời gian timeout (ms)
  queueLimit: 0,
  charset: 'utf8mb4_unicode_ci',
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

/**
 * Hàm kiểm tra và khởi động kết nối MySQL
 */
export const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`=========================================`);
    console.log(`✅ [MySQL Connected] Kết nối thành công!`);
    console.log(`📍 Host: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3060}`);
    console.log(`🗄️  Database: ${process.env.DB_NAME || 'datn_learning_db'}`);
    console.log(`👤 User: ${process.env.DB_USER || 'root'}`);
    console.log(`=========================================`);
    connection.release();
    return true;
  } catch (error) {
    console.error(`=========================================`);
    console.error(`❌ [MySQL Connection Error] Không thể kết nối cơ sở dữ liệu!`);
    console.error(`Chi tiết lỗi: ${error.message}`);
    console.error(`👉 Gợi ý kiểm tra:`);
    console.error(`  1. Đảm bảo dịch vụ MySQL đang chạy trên cổng ${process.env.DB_PORT || 3060}.`);
    console.error(`  2. Kiểm tra mật khẩu tài khoản root (hiện tại là 1234).`);
    console.error(`  3. Đảm bảo bạn đã tạo database: datn_learning_db (chạy file database/schema.sql).`);
    console.error(`=========================================`);
    return false;
  }
};

export default pool;
