import db from '../config/db.js';

/**
 * LẤY DANH SÁCH KHÓA HỌC
 * GET /api/v1/courses
 */
export const getCourses = async (req, res, next) => {
  try {
    const { category, featured, limit } = req.query;

    let sql = `
      SELECT 
        c.id, c.title, c.slug, c.description, c.price, c.duration,
        c.thumbnail,
        c.students_count,
        c.category_id,
        cat.name AS category_name, cat.slug AS category_slug,
        u.name AS instructor_name,
        (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) AS total_lessons_count
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE 1=1
    `;

    const params = [];

    if (category) {
      sql += ` AND cat.slug = ?`;
      params.push(category);
    }

    sql += ` ORDER BY c.id ASC`;

    if (limit) {
      sql += ` LIMIT ?`;
      params.push(Number(limit));
    }

    const [courses] = await db.query(sql, params);

    // Chuẩn hóa format trường cho client React
    const formatted = courses.map((c, index) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      description: c.description || 'Chương trình đào tạo thực chiến chuẩn doanh nghiệp',
      price: c.price,
      original_price: Number(c.price) > 0 ? (Number(c.price) * 1.5).toFixed(2) : null,
      duration: c.duration,
      total_duration_hours: parseInt(c.duration) || 40,
      thumbnail_url: c.thumbnail?.startsWith('http') 
        ? c.thumbnail 
        : `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80`,
      students_count: c.students_count || 500,
      total_lessons_count: Number(c.total_lessons_count) || 20,
      is_featured: index < 4 || c.students_count > 800,
      category_name: c.category_name || 'Lập trình',
      category_slug: c.category_slug,
      instructor_name: c.instructor_name || 'Học Lập Trình Để Đi Làm',
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
 * LẤY CHI TIẾT KHÓA HỌC KÈM BÀI HỌC
 * GET /api/v1/courses/:slug
 */
export const getCourseBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const sqlCourse = `
      SELECT 
        c.id, c.title, c.slug, c.description, c.price, c.duration,
        c.thumbnail,
        c.students_count,
        c.category_id,
        cat.name AS category_name, cat.slug AS category_slug,
        u.name AS instructor_name, u.avatar AS instructor_avatar
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.slug = ?
      LIMIT 1
    `;
    const [courses] = await db.query(sqlCourse, [slug]);

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khóa học yêu cầu',
      });
    }

    const course = courses[0];

    // Lấy danh sách bài học thuộc khóa học gom theo chương (section_name)
    const sqlLessons = `
      SELECT id, course_id, section_name, title, video_url, content, is_free_preview, order_index
      FROM lessons
      WHERE course_id = ?
      ORDER BY order_index ASC
    `;
    const [lessons] = await db.query(sqlLessons, [course.id]);

    // Gom bài học theo chương (sections)
    const sectionsMap = {};
    lessons.forEach((l) => {
      const section = l.section_name || 'Chương 1: Tổng quan';
      if (!sectionsMap[section]) {
        sectionsMap[section] = [];
      }
      sectionsMap[section].push({
        id: l.id,
        title: l.title,
        video_url: l.video_url,
        content: l.content,
        is_free_preview: Boolean(l.is_free_preview),
        order_index: l.order_index,
      });
    });

    const sections = Object.keys(sectionsMap).map((secName, idx) => ({
      id: idx + 1,
      name: secName,
      lessons: sectionsMap[secName],
    }));

    const formatted = {
      ...course,
      thumbnail_url: course.thumbnail?.startsWith('http') 
        ? course.thumbnail 
        : `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80`,
      total_lessons_count: lessons.length,
      sections,
    };

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};
