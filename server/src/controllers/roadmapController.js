import db from '../config/db.js';

/**
 * LẤY TẤT CẢ LỘ TRÌNH NGHỀ NGHIỆP
 * GET /api/v1/roadmaps
 */
export const getRoadmaps = async (req, res, next) => {
  try {
    const sql = `
      SELECT id, title, slug, description, steps_json, skills_json
      FROM roadmaps
      ORDER BY id ASC
    `;
    const [roadmaps] = await db.query(sql);

    // Chuẩn hóa JSON và định dạng trường cho client
    const formatted = roadmaps.map((item) => {
      let rawSteps = typeof item.steps_json === 'string' ? JSON.parse(item.steps_json) : (item.steps_json || []);
      let rawSkills = typeof item.skills_json === 'string' ? JSON.parse(item.skills_json) : (item.skills_json || []);

      // Đảm bảo steps luôn là mảng đối tượng { num, title }
      const steps = rawSteps.map((st, i) => {
        if (typeof st === 'string') {
          return { num: i + 1, title: st };
        }
        return { num: st.num || (i + 1), title: st.title || st.name || `Chặng ${i + 1}` };
      });

      return {
        id: item.id,
        title: item.title,
        slug: item.slug,
        tag_badge: item.title.replace('Lộ trình ', '').replace('Lộ trình học ', ''),
        description: item.description,
        courses_count: steps.length * 2 || 8,
        hours_count: `${steps.length * 30 || 120}+`,
        projects_count: Math.max(3, steps.length),
        steps,
        skills: rawSkills,
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
 * LẤY CHI TIẾT 1 LỘ TRÌNH
 * GET /api/v1/roadmaps/:slug
 */
export const getRoadmapBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const sql = `
      SELECT id, title, slug, description, steps_json, skills_json
      FROM roadmaps
      WHERE slug = ?
      LIMIT 1
    `;
    const [rows] = await db.query(sql, [slug]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lộ trình yêu cầu' });
    }

    const item = rows[0];
    let rawSteps = typeof item.steps_json === 'string' ? JSON.parse(item.steps_json) : (item.steps_json || []);
    let rawSkills = typeof item.skills_json === 'string' ? JSON.parse(item.skills_json) : (item.skills_json || []);

    const steps = rawSteps.map((st, i) => {
      if (typeof st === 'string') {
        return { num: i + 1, title: st };
      }
      return { num: st.num || (i + 1), title: st.title || st.name || `Chặng ${i + 1}` };
    });

    const data = {
      id: item.id,
      title: item.title,
      slug: item.slug,
      tag_badge: item.title.replace('Lộ trình ', '').replace('Lộ trình học ', ''),
      description: item.description,
      courses_count: steps.length * 2 || 8,
      hours_count: `${steps.length * 30 || 120}+`,
      projects_count: Math.max(3, steps.length),
      steps,
      skills: rawSkills,
    };

    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
