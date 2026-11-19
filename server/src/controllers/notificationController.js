import db from '../config/db.js';

/**
 * LẤY DANH SÁCH THÔNG BÁO HOẶC NHẬT KÝ HOẠT ĐỘNG
 * GET /api/v1/notifications
 */
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type } = req.query; // 'notification' hoặc 'activity'

    const sql = `
      SELECT id, user_id, title, message, is_read, created_at
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
    const [rows] = await db.query(sql, [userId]);

    const formatted = rows.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.message,
      message: item.message,
      course: 'Hệ thống Edusmart',
      link: '/khoa-hoc-cua-toi',
      isRead: Boolean(item.is_read),
      time: new Date(item.created_at).toLocaleString('vi-VN'),
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
