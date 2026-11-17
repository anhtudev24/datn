import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Newsfeed.css';

const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'frontend', label: 'Front-end' },
  { id: 'backend', label: 'Back-end' },
  { id: 'devops', label: 'DevOps & Cloud' },
  { id: 'career', label: 'Kinh nghiệm phỏng vấn' },
  { id: 'tips', label: 'Mẹo Clean Code' },
];

const ARTICLES = [
  {
    id: 1,
    title: 'Xây dựng kiến trúc Clean Architecture với Node.js & TypeScript',
    summary: 'Phân tách rành mạch các lớp Controller, Service, Repository giúp mã nguồn dễ mở rộng, bảo trì và viết Unit Test hiệu quả trong dự án lớn.',
    author: {
      name: 'Sơn Đặng',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    },
    publishedAt: '2 ngày trước',
    readTime: '6 phút đọc',
    category: 'backend',
    tags: ['Node.js', 'TypeScript', 'Architecture'],
    views: '3.420',
    likes: 184,
    comments: 29,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80',
  },
  {
    id: 2,
    title: 'Tối ưu hóa Performance trong React 18: useMemo, useCallback & useTransition',
    summary: 'Khi nào bạn thực sự cần tối ưu render? Phân tích các trường hợp lạm dụng memo hóa và cách sử dụng Concurrent Features để UI luôn mượt mà.',
    author: {
      name: 'Anh Tú',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    },
    publishedAt: '4 ngày trước',
    readTime: '8 phút đọc',
    category: 'frontend',
    tags: ['React.js', 'Performance', 'Hooks'],
    views: '4.850',
    likes: 312,
    comments: 45,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80',
  },
  {
    id: 3,
    title: 'Hành trình từ Zero đến triển khai ứng dụng tự động bằng Docker & GitHub Actions',
    summary: 'Hướng dẫn từng bước cấu hình CI/CD pipeline, tự động build Docker image, chạy test và deploy lên server VPS mỗi khi push code lên nhánh main.',
    author: {
      name: 'Hoàng Nam',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    },
    publishedAt: '1 tuần trước',
    readTime: '10 phút đọc',
    category: 'devops',
    tags: ['Docker', 'CI/CD', 'GitHub Actions'],
    views: '2.910',
    likes: 195,
    comments: 18,
    thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=400&q=80',
  },
  {
    id: 4,
    title: 'Kinh nghiệm vượt qua vòng phỏng vấn kỹ thuật Fullstack tại các công ty Tech',
    summary: 'Những câu hỏi kinh điển về Database indexing, Caching với Redis, xử lý bất đồng bộ và kỹ năng giải quyết bài toán System Design căn bản.',
    author: {
      name: 'Minh Quân',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80',
    },
    publishedAt: '2 tuần trước',
    readTime: '7 phút đọc',
    category: 'career',
    tags: ['Career', 'Interview', 'System Design'],
    views: '6.200',
    likes: 420,
    comments: 63,
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80',
  },
];

const TRENDING_TOPICS = [
  { tag: 'React.js', count: 142 },
  { tag: 'Node.js', count: 98 },
  { tag: 'Docker', count: 64 },
  { tag: 'TypeScript', count: 87 },
  { tag: 'Clean Code', count: 52 },
  { tag: 'PostgreSQL', count: 41 },
];

const TOP_ARTICLES = [
  { id: 1, title: 'Tổng hợp 50 câu hỏi phỏng vấn JavaScript phổ biến nhất 2026', date: 'Tháng 11, 2026' },
  { id: 2, title: 'Lộ trình tự học lập trình Web Fullstack chuẩn chỉnh cho người mới', date: 'Tháng 10, 2026' },
  { id: 3, title: 'Cách viết Git Commit Message chuẩn Conventional Commits', date: 'Tháng 10, 2026' },
];

const NewsfeedPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredArticles = activeTab === 'all'
    ? ARTICLES
    : ARTICLES.filter((art) => art.category === activeTab);

  return (
    <div className="newsfeed-page">
      {/* Header */}
      <div className="newsfeed-header">
        <h1 className="newsfeed-header__title">Bảng tin cộng đồng</h1>
        <p className="newsfeed-header__desc">
          Tổng hợp các bài viết chia sẻ kinh nghiệm thực chiến, mẹo lập trình và kiến thức công nghệ mới nhất từ cộng đồng học viên và chuyên gia.
        </p>
      </div>

      {/* Tabs danh mục */}
      <div className="newsfeed-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`newsfeed-tab-btn ${activeTab === cat.id ? 'active' : ''}`}
            onClick={() => setActiveTab(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Bố cục 2 cột */}
      <div className="newsfeed-layout">
        {/* Cột trái: Danh sách bài viết */}
        <div className="newsfeed-articles">
          {filteredArticles.map((article) => (
            <article key={article.id} className="article-card">
              <div className="article-card__main">
                {/* Tác giả */}
                <div className="article-author">
                  <img src={article.author.avatar} alt={article.author.name} className="article-author__avatar" />
                  <span className="article-author__name">{article.author.name}</span>
                  <span className="article-author__dot">•</span>
                  <span className="article-author__time">{article.publishedAt}</span>
                  <span className="article-author__dot">•</span>
                  <span className="article-author__time">{article.readTime}</span>
                </div>

                {/* Tiêu đề & Tóm tắt */}
                <h2 className="article-title">
                  <a href="#article" onClick={(e) => e.preventDefault()}>
                    {article.title}
                  </a>
                </h2>
                <p className="article-summary">{article.summary}</p>

                {/* Tags & Meta tương tác */}
                <div className="article-card__footer">
                  <div className="article-tags">
                    {article.tags.map((t) => (
                      <span key={t} className="article-tag">#{t}</span>
                    ))}
                  </div>

                  <div className="article-meta">
                    <span className="article-meta__item" title="Lượt xem">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {article.views}
                    </span>
                    <span className="article-meta__item" title="Lượt thích">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      {article.likes}
                    </span>
                    <span className="article-meta__item" title="Bình luận">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                      {article.comments}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thumbnail bên phải */}
              <img src={article.thumbnail} alt={article.title} className="article-thumb" />
            </article>
          ))}
        </div>

        {/* Cột phải: Sidebar Widgets */}
        <aside className="newsfeed-sidebar">
          {/* Banner tạo bài viết */}
          <div className="newsfeed-create-banner">
            <h4>Chia sẻ kiến thức của bạn</h4>
            <p>Viết bài chia sẻ kinh nghiệm học tập hoặc giải pháp kỹ thuật cùng cộng đồng hơn 185.000 học viên.</p>
            <Link to="/bang-tin" className="newsfeed-btn-write">
              Viết bài ngay
            </Link>
          </div>

          {/* Chủ đề quan tâm */}
          <div className="newsfeed-widget">
            <h3 className="newsfeed-widget__title">Chủ đề được quan tâm</h3>
            <div className="widget-tags-cloud">
              {TRENDING_TOPICS.map((topic) => (
                <a key={topic.tag} href="#topic" className="widget-tag-item" onClick={(e) => e.preventDefault()}>
                  <span>#{topic.tag}</span>
                  <span className="widget-tag-count">{topic.count}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Bài viết nổi bật */}
          <div className="newsfeed-widget">
            <h3 className="newsfeed-widget__title">Bài viết nổi bật trong tuần</h3>
            <div className="trending-articles-list">
              {TOP_ARTICLES.map((top, idx) => (
                <div key={top.id} className="trending-item">
                  <span className="trending-item__num">0{idx + 1}</span>
                  <div className="trending-item__content">
                    <h4 className="trending-item__title">
                      <a href="#article" onClick={(e) => e.preventDefault()}>{top.title}</a>
                    </h4>
                    <span className="trending-item__date">{top.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NewsfeedPage;
