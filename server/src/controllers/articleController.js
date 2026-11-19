import db from '../config/db.js';

/**
 * LẤY DANH SÁCH BÀI VIẾT BẢNG TIN
 * GET /api/v1/articles
 */
export const getArticles = async (req, res, next) => {
  try {
    const { category, limit } = req.query;

    let sql = `
      SELECT 
        a.id, a.title, a.slug, a.content, a.tags_json, a.created_at AS published_at,
        u.name AS author_name, u.avatar AS author_avatar,
        (SELECT COUNT(*) FROM article_comments c WHERE c.article_id = a.id) AS comments_count
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE 1=1
    `;

    const params = [];

    // Lọc theo tag nếu có
    if (category && category !== 'all') {
      sql += ` AND (JSON_SEARCH(a.tags_json, 'one', ?) IS NOT NULL OR a.title LIKE ?)`;
      params.push(`%${category}%`, `%${category}%`);
    }

    sql += ` ORDER BY a.created_at DESC`;

    if (limit) {
      sql += ` LIMIT ?`;
      params.push(Number(limit));
    }

    const [articles] = await db.query(sql, params);

    const formatted = articles.map((art, idx) => {
      let rawTags = typeof art.tags_json === 'string' ? JSON.parse(art.tags_json) : (art.tags_json || []);
      if (!Array.isArray(rawTags)) rawTags = ['Lập trình'];

      // Tạo tóm tắt từ nội dung
      const cleanContent = art.content ? art.content.replace(/[#*`\n]/g, ' ').trim() : '';
      const summary = cleanContent.length > 150 ? cleanContent.substring(0, 150) + '...' : cleanContent;

      return {
        id: art.id,
        title: art.title,
        slug: art.slug,
        summary: summary || 'Bài viết chia sẻ kiến thức và kinh nghiệm lập trình từ chuyên gia.',
        content: art.content,
        thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80',
        category: rawTags[0]?.toLowerCase() || 'frontend',
        read_time_minutes: 5,
        tags: rawTags,
        views_count: 1200 + (art.id * 215),
        likes_count: 45 + (art.id * 18),
        comments_count: Number(art.comments_count) || 0,
        published_at: art.published_at,
        author: {
          name: art.author_name || 'Tác giả Edusmart',
          avatar: art.author_avatar?.startsWith('http') 
            ? art.author_avatar 
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
        },
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
 * LẤY CHI TIẾT BÀI VIẾT KÈM BÌNH LUẬN
 * GET /api/v1/articles/:slug
 */
export const getArticleBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const sqlArticle = `
      SELECT 
        a.id, a.title, a.slug, a.content, a.tags_json, a.created_at AS published_at,
        u.name AS author_name, u.avatar AS author_avatar
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.slug = ?
      LIMIT 1
    `;
    const [rows] = await db.query(sqlArticle, [slug]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết yêu cầu' });
    }

    const article = rows[0];

    // Lấy bình luận
    const sqlComments = `
      SELECT 
        c.id, c.content, c.created_at, c.parent_id,
        u.id AS user_id, u.name AS user_name, u.avatar AS user_avatar
      FROM article_comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.article_id = ?
      ORDER BY c.created_at ASC
    `;
    const [comments] = await db.query(sqlComments, [article.id]);

    let rawTags = typeof article.tags_json === 'string' ? JSON.parse(article.tags_json) : (article.tags_json || []);
    if (!Array.isArray(rawTags)) rawTags = ['Lập trình'];

    const formatted = {
      ...article,
      tags: rawTags,
      author: {
        name: article.author_name || 'Tác giả',
        avatar: article.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
      },
      comments: comments.map(c => ({
        ...c,
        user_avatar: c.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'
      })),
    };

    return res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

/**
 * BÌNH LUẬN BÀI VIẾT
 * POST /api/v1/articles/:id/comments
 */
export const addComment = async (req, res, next) => {
  try {
    const articleId = req.params.id;
    const userId = req.user.id;
    const { content, parentId } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Nội dung bình luận không được rỗng' });
    }

    const sql = `
      INSERT INTO article_comments (article_id, user_id, parent_id, content)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [articleId, userId, parentId || null, content.trim()]);

    return res.status(201).json({
      success: true,
      message: 'Gửi bình luận thành công',
      data: {
        id: result.insertId,
        content: content.trim(),
        created_at: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};
