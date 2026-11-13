/**
 * Cấu hình kết nối cơ sở dữ liệu
 * Bạn có thể mở kết nối tương ứng với MongoDB (Mongoose) hoặc SQL (Sequelize/Prisma)
 */

export const connectDB = async () => {
  try {
    // Ví dụ với MongoDB:
    // import mongoose from 'mongoose';
    // const conn = await mongoose.connect(process.env.MONGO_URI);
    // console.log(`MongoDB Connected: ${conn.connection.host}`);

    console.log('[Database] Kết nối database sẵn sàng (hãy cấu hình chuỗi kết nối trong .env)');
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    process.exit(1);
  }
};
