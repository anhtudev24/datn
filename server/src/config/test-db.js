import pool, { connectDB } from './db.js';

const testConnection = async () => {
  console.log('🔄 Đang kiểm tra kết nối MySQL...');
  const isConnected = await connectDB();

  if (isConnected) {
    try {
      const [tables] = await pool.query('SHOW TABLES;');
      console.log(`📋 Danh sách các bảng hiện có trong database (${tables.length} bảng):`);
      console.table(tables);
    } catch (err) {
      console.error('Lỗi khi truy vấn danh sách bảng:', err.message);
    } finally {
      await pool.end();
      process.exit(0);
    }
  } else {
    process.exit(1);
  }
};

testConnection();
