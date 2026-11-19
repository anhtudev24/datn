import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Newsfeed.css';

const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'frontend', label: 'Front-end' },
  { id: 'backend', label: 'Back-end' },
  { id: 'devops', label: 'DevOps & Cloud' },
  { id: 'career', label: 'Kinh nghiệm phỏng vấn' },
  { id: 'tips', label: 'Mẹo Clean Code' },
];

const formatDate = (dateStr) => {
  if (!dateStr) return 'Vừa đăng';
  try {
    const d = new Date(dateStr);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
    return d.toLocaleDateString('vi-VN');
  } catch {
    return dateStr;
  }
};

const NewsfeedPage = () => {
  // const [activeTab, setActiveTab] = useState('all');
  // const [articles, setArticles] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchArticles = async () => {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const url = activeTab === 'all' ? '/articles' : `/articles?category=${activeTab}`;
  //       const res = await api.get(url);
  //       setArticles(res.data || []);
  //     } catch (err) {
  //       console.error('Lỗi tải bài viết:', err);
  //       setError('Không thể tải bài viết. Vui lòng thử lại.');
  //       setArticles([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchArticles();
  // }, [activeTab]);

  // const uniqueTags = Array.from(
  //   new Set(articles.flatMap((a) => (Array.isArray(a.tags) ? a.tags : [])))
  // );

  // return (
  //   <div className="newsfeed-page">
  //     {/* Header */}
  //     <div className="newsfeed-header">
  //       <h1 className="newsfeed-header__title">Bảng tin cộng đồng</h1>
  //       <p className="newsfeed-header__desc">
  //         Tổng hợp các bài viết chia sẻ kinh nghiệm thực chiến, mẹo lập trình và kiến thức công nghệ mới nhất từ cộng đồng học viên và chuyên gia.
  //       </p>
  //     </div>

  //     {/* Tabs danh mục */}
  //     <div className="newsfeed-tabs">
  //       {CATEGORIES.map((cat) => (
  //         <button
  //           key={cat.id}
  //           type="button"
  //           className={`newsfeed-tab-btn ${activeTab === cat.id ? 'active' : ''}`}
  //           onClick={() => setActiveTab(cat.id)}
  //         >
  //           {cat.label}
  //         </button>
  //       ))}
  //     </div>

  //     {/* Bố cục 2 cột */}
  //     <div className="newsfeed-layout">
  //       {/* Cột trái: Danh sách bài viết */}
  //       <div className="newsfeed-articles">
  //         {loading && (
  //           <div className="newsfeed-state">Đang tải bài viết từ hệ thống...</div>
  //         )}
  //         {!loading && error && (
  //           <div className="newsfeed-state newsfeed-state--error">{error}</div>
  //         )}
  //         {!loading && !error && articles.length === 0 && (
  //           <div className="newsfeed-state">Chưa có bài viết nào trong danh mục này.</div>
  //         )}
  //         {!loading && !error && articles.map((article) => (
  //           <article key={article.id} className="article-card">
  //             <div className="article-card__main">
  //               {/* Tác giả */}
  //               <div className="article-author">
  //                 {article.author?.avatar ? (
  //                   <img src={article.author.avatar} alt={article.author.name} className="article-author__avatar" />
  //                 ) : (
  //                   <div className="article-author__avatar article-author__avatar--placeholder">
  //                     <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
  //                       <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  //                     </svg>
  //                   </div>
  //                 )}
  //                 <span className="article-author__name">{article.author?.name || 'Tác giả'}</span>
  //                 <span className="article-author__dot">•</span>
  //                 <span className="article-author__time">{formatDate(article.published_at)}</span>
  //                 <span className="article-author__dot">•</span>
  //                 <span className="article-author__time">{article.read_time_minutes || 5} phút đọc</span>
  //               </div>

  //               {/* Tiêu đề & Tóm tắt */}
  //               <h2 className="article-title">
  //                 <a href="#article" onClick={(e) => e.preventDefault()}>
  //                   {article.title}
  //                 </a>
  //               </h2>
  //               <p className="article-summary">{article.summary}</p>

  //               {/* Tags & Meta tương tác */}
  //               <div className="article-card__footer">
  //                 <div className="article-tags">
  //                   {(Array.isArray(article.tags) ? article.tags : []).map((t) => (
  //                     <span key={t} className="article-tag">#{t}</span>
  //                   ))}
  //                 </div>

  //                 <div className="article-meta">
  //                   <span className="article-meta__item" title="Lượt xem">
  //                     <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
  //                       <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
  //                       <circle cx="12" cy="12" r="3" />
  //                     </svg>
  //                     {(article.views_count || 0).toLocaleString('vi-VN')}
  //                   </span>
  //                   <span className="article-meta__item" title="Lượt thích">
  //                     <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
  //                       <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  //                     </svg>
  //                     {article.likes_count || 0}
  //                   </span>
  //                   <span className="article-meta__item" title="Bình luận">
  //                     <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
  //                       <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  //                     </svg>
  //                     {article.comments_count || 0}
  //                   </span>
  //                 </div>
  //               </div>
  //             </div>

  //             {/* Thumbnail bên phải */}
  //             {article.thumbnail_url && (
  //               <img src={article.thumbnail_url} alt={article.title} className="article-thumb" />
  //             )}
  //           </article>
  //         ))}
  //       </div>

  //       {/* Cột phải: Sidebar */}
  //       <aside className="newsfeed-sidebar">
  //         {/* Banner tạo bài viết */}
  //         <div className="newsfeed-create-banner">
  //           <h4>Chia sẻ kiến thức của bạn</h4>
  //           <p>Viết bài chia sẻ kinh nghiệm học tập hoặc giải pháp kỹ thuật cùng cộng đồng hơn 185.000 học viên.</p>
  //           <Link to="/bang-tin" className="newsfeed-btn-write">
  //             Viết bài ngay
  //           </Link>
  //         </div>

  //         {/* Chủ đề quan tâm */}
  //         {uniqueTags.length > 0 && (
  //           <div className="newsfeed-widget">
  //             <h3 className="newsfeed-widget__title">Chủ đề từ bài viết</h3>
  //             <div className="widget-tags-cloud">
  //               {uniqueTags.map((tag) => (
  //                 <button
  //                   key={tag}
  //                   type="button"
  //                   className="widget-tag-item"
  //                   onClick={() => setActiveTab(tag.toLowerCase())}
  //                 >
  //                   <span>#{tag}</span>
  //                 </button>
  //               ))}
  //             </div>
  //           </div>
  //         )}
  //       </aside>
  //     </div>
  //   </div>
  // );
};

export default NewsfeedPage;
