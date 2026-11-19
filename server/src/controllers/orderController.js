import db from '../config/db.js';

/**
 * LẤY DANH SÁCH ĐƠN HÀNG CỦA HỌC VIÊN
 * GET /api/v1/orders
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const sql = `
      SELECT 
        o.id, o.order_code, o.total_amount, o.transaction_code, o.payment_gateway,
        o.status, o.created_at,
        c.id AS course_id, c.title AS course_name, c.thumbnail, c.slug AS course_slug
      FROM orders o
      JOIN courses c ON o.course_id = c.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `;
    const [rows] = await db.query(sql, [userId]);

    const formatted = rows.map((item) => ({
      id: item.order_code,
      courseId: item.course_id,
      courseName: item.course_name,
      courseSlug: item.course_slug,
      date: new Date(item.created_at).toLocaleDateString('vi-VN'),
      price: Number(item.total_amount).toLocaleString('vi-VN') + ' đ',
      originalPrice: (Number(item.total_amount) * 1.5).toLocaleString('vi-VN') + ' đ',
      status: item.status === 'completed' ? 'Đã kích hoạt' : (item.status === 'pending' ? 'Chờ xử lý' : 'Thất bại'),
      paymentMethod: item.payment_gateway || 'VNPay',
      thumbnail: item.thumbnail?.startsWith('http') 
        ? item.thumbnail 
        : 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * LẤY LỊCH SỬ GIAO DỊCH THANH TOÁN
 * GET /api/v1/orders/payments
 */
export const getMyPayments = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const sql = `
      SELECT 
        o.id, o.transaction_code, o.total_amount, o.payment_gateway,
        o.status, o.created_at,
        c.title AS course_title
      FROM orders o
      LEFT JOIN courses c ON o.course_id = c.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `;
    const [rows] = await db.query(sql, [userId]);

    const formatted = rows.map((item) => ({
      transactionId: item.transaction_code || `TXN-${item.id}`,
      content: `Thanh toán khóa học ${item.course_title || 'Edusmart'}`,
      amount: Number(item.total_amount).toLocaleString('vi-VN') + ' đ',
      method: item.payment_gateway || 'Ngân hàng',
      date: new Date(item.created_at).toLocaleString('vi-VN'),
      status: item.status === 'completed' ? 'Thành công' : (item.status === 'pending' ? 'Đang xử lý' : 'Thất bại'),
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * MUA KHÓA HỌC (TẠO ĐƠN HÀNG VÀ KÍCH HOẠT)
 * POST /api/v1/orders
 */
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { course_id, payment_gateway } = req.body;

    if (!course_id) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mã khóa học (course_id)' });
    }

    // Kiểm tra khóa học
    const [courses] = await db.query('SELECT id, title, price FROM courses WHERE id = ?', [course_id]);
    if (!courses || courses.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học yêu cầu' });
    }
    const course = courses[0];

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderCode = `DH-${randomSuffix}`;
    const transactionCode = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const gateway = payment_gateway || 'VNPay';
    const amount = Number(course.price) || 0;

    // Tạo đơn hàng
    await db.query(`
      INSERT INTO orders (order_code, user_id, course_id, total_amount, transaction_code, payment_gateway, status)
      VALUES (?, ?, ?, ?, ?, ?, 'completed')
    `, [orderCode, userId, course_id, amount, transactionCode, gateway]);

    // Đồng thời kích hoạt ghi danh khóa học trong enrollments nếu chưa có
    const [existingEnrollment] = await db.query('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?', [userId, course_id]);
    if (!existingEnrollment || existingEnrollment.length === 0) {
      await db.query(`
        INSERT INTO enrollments (user_id, course_id, progress_percent, current_lesson_title)
        VALUES (?, ?, 0.00, 'Bắt đầu bài học đầu tiên')
      `, [userId, course_id]);

      await db.query('UPDATE courses SET students_count = students_count + 1 WHERE id = ?', [course_id]);
    }

    // Gửi thông báo
    try {
      await db.query(`
        INSERT INTO notifications (user_id, title, message)
        VALUES (?, 'Mua khóa học thành công', ?)
      `, [userId, `Đơn hàng ${orderCode} cho khóa học "${course.title}" đã thanh toán thành công qua ${gateway}.`]);
    } catch {
      // bỏ qua lỗi thông báo
    }

    return res.status(201).json({
      success: true,
      message: 'Thanh toán thành công! Khóa học đã được kích hoạt.',
      data: {
        orderCode,
        transactionCode,
        amount,
        courseTitle: course.title,
      },
    });
  } catch (error) {
    next(error);
  }
};
