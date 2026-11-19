import db from '../config/db.js';

/**
 * LẤY DANH SÁCH KHÓA HỌC CỦA HỌC VIÊN
 * GET /api/v1/enrollments
 */
export const getMyEnrollments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let sql = `
      SELECT 
        e.id AS enrollment_id, e.progress_percent,
        e.current_lesson_title, e.certificate_code, e.enrolled_at,
        c.id AS course_id, c.title, c.slug, c.thumbnail,
        u.name AS instructor_name,
        (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) AS total_lessons_count
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE e.user_id = ?
    `;

    const params = [userId];

    if (status === 'completed') {
      sql += ` AND e.progress_percent >= 100`;
    } else if (status === 'in_progress') {
      sql += ` AND e.progress_percent < 100`;
    }

    sql += ` ORDER BY e.updated_at DESC`;

    const [rows] = await db.query(sql, params);

    const formatted = rows.map((item) => {
      const progress = Number(item.progress_percent) || 0;
      const totalLessons = Number(item.total_lessons_count) || 20;
      const completedLessons = Math.round((progress / 100) * totalLessons);

      return {
        id: item.enrollment_id,
        courseId: item.course_id,
        title: item.title,
        slug: item.slug,
        author: item.instructor_name || 'Học Lập Trình Để Đi Làm',
        thumbnail: item.thumbnail?.startsWith('http') 
          ? item.thumbnail 
          : 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
        progress: progress,
        completedLessons: completedLessons,
        totalLessons: totalLessons,
        currentLesson: item.current_lesson_title || (progress >= 100 ? 'Đã hoàn thành toàn bộ khóa học' : 'Bắt đầu học bài đầu tiên'),
        certificateCode: item.certificate_code,
        status: progress >= 100 ? 'completed' : 'in_progress',
      };
    });

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
 * ĐĂNG KÝ HỌC KHÓA HỌC (MIỄN PHÍ HOẶC KÍCH HOẠT)
 * POST /api/v1/enrollments
 */
export const enrollCourse = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { course_id } = req.body;

    if (!course_id) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mã khóa học (course_id)' });
    }

    // Kiểm tra khóa học có tồn tại
    const [courses] = await db.query('SELECT id, title, price FROM courses WHERE id = ?', [course_id]);
    if (!courses || courses.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học yêu cầu' });
    }
    const course = courses[0];

    // Kiểm tra đã đăng ký trước đó chưa
    const [existing] = await db.query('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?', [userId, course_id]);
    if (existing && existing.length > 0) {
      return res.status(200).json({
        success: true,
        alreadyEnrolled: true,
        message: 'Bạn đã đăng ký khóa học này rồi! Có thể vào học ngay.',
      });
    }

    // Thêm vào bảng enrollments
    await db.query(`
      INSERT INTO enrollments (user_id, course_id, progress_percent, current_lesson_title)
      VALUES (?, ?, 0.00, 'Bắt đầu bài học đầu tiên')
    `, [userId, course_id]);

    // Tăng số học viên
    await db.query('UPDATE courses SET students_count = students_count + 1 WHERE id = ?', [course_id]);

    // Gửi thông báo chúc mừng
    try {
      await db.query(`
        INSERT INTO notifications (user_id, title, message)
        VALUES (?, 'Đăng ký thành công', ?)
      `, [userId, `Chúc mừng bạn đã ghi danh thành công khóa học "${course.title}". Hãy bắt đầu ngay!`]);
    } catch {
      // Bỏ qua nếu có lỗi gửi thông báo
    }

    return res.status(201).json({
      success: true,
      message: 'Ghi danh khóa học thành công!',
      data: {
        courseId: course.id,
        courseTitle: course.title,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * CẬP NHẬT TIẾN ĐỘ HỌC TẬP VÀ BÀI HỌC HIỆN TẠI
 * PUT /api/v1/enrollments/progress
 * body: { course_id, current_lesson_title, progress_percent }
 */
export const updateProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { course_id, current_lesson_title, progress_percent } = req.body;

    if (!course_id) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mã khóa học (course_id)' });
    }

    // Kiểm tra xem đã enroll chưa
    const [existing] = await db.query(
      'SELECT id, progress_percent, certificate_code FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, course_id]
    );

    let certCode = null;
    const newProgress = Math.min(100, Math.max(0, Number(progress_percent) || 0));

    if (existing.length === 0) {
      // Nếu chưa có, tự động tạo mới enrollment
      if (newProgress >= 100) {
        certCode = `CERT-EDUS-${Date.now().toString().slice(-6)}`;
      }
      await db.query(
        `INSERT INTO enrollments (user_id, course_id, progress_percent, current_lesson_title, certificate_code)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, course_id, newProgress, current_lesson_title || 'Đang học', certCode]
      );
    } else {
      certCode = existing[0].certificate_code;
      if (newProgress >= 100 && !certCode) {
        certCode = `CERT-EDUS-${Date.now().toString().slice(-6)}`;
      }
      await db.query(
        `UPDATE enrollments 
         SET progress_percent = ?, current_lesson_title = ?, certificate_code = ?
         WHERE user_id = ? AND course_id = ?`,
        [newProgress, current_lesson_title || existing[0].current_lesson_title, certCode, userId, course_id]
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Cập nhật tiến độ thành công!',
      data: {
        progress_percent: newProgress,
        current_lesson_title,
        certificate_code: certCode,
      },
    });
  } catch (error) {
    next(error);
  }
};
