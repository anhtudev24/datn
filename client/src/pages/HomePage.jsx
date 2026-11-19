import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './HomePage.css';

const CourseCard = ({ course, variant = 'default' }) => {
  const accentColor = course.accentColor || (variant === 'paid' ? '#8b5cf6' : variant === 'free' ? '#2563eb' : '#0ea5e9');
  const isPro = Number(course.price) > 0;

  return (
    <Link to={`/courses/${course.slug}`} className="course-card">
      <div className="course-card__header">
        <div className="course-card__badge-row">
          <span
            className="course-card__tag"
            style={{
              borderColor: `${accentColor}40`,
              color: accentColor,
              backgroundColor: `${accentColor}12`,
            }}
          >
            {course.category_name || course.tag || 'Lập trình'}
          </span>
          {isPro && <span className="course-card__pro-tag">Pro</span>}
        </div>
        <h3 className="course-card__title">{course.title}</h3>
        <p className="course-card__subtitle">{course.description || 'Chương trình đào tạo thực chiến chuẩn doanh nghiệp'}</p>
      </div>

      <div className="course-card__footer">
        {variant === 'free' && (
          <div className="course-card__meta">
            <span className="course-card__meta-item">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              <span className="tabular-num">{(course.students_count || 0).toLocaleString('vi-VN')}</span> học viên
            </span>
            <span className="course-card__meta-dot">•</span>
            <span className="course-card__meta-item">
              <span className="tabular-num">{course.total_lessons_count || 0}</span> bài học
            </span>
          </div>
        )}

        {variant === 'paid' && (
          <div className="course-card__pricing">
            <span className="course-card__price tabular-num">
              {Number(course.price).toLocaleString('vi-VN')}đ
            </span>
            {course.original_price && (
              <span className="course-card__old-price tabular-num">
                {Number(course.original_price).toLocaleString('vi-VN')}đ
              </span>
            )}
          </div>
        )}

        {variant === 'default' && (
          <div className="course-card__action-hint">
            <span>Xem khóa học</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </Link>
  );
};

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await api.get('/courses');
        if (res.data ) {
          setCourses(res.data);
        }
      } catch (err) {
        console.error('Lỗi khi tải khóa học từ server:', err);
        setError(err.message || 'Không thể kết nối máy chủ');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Lọc khóa học theo thuộc tính lấy từ Database API
  const featuredCourses = courses.filter((c) => Boolean(c.is_featured));
  const freeCourses = courses.filter((c) => Number(c.price) === 0);
  const paidCourses = courses.filter((c) => Number(c.price) > 0);

  return (
    <div className="home">
      {/* ===== HERO BANNER ===== */}
      <section className="home__banner">
        <div className="home__banner-content">
          <div className="home__banner-badge">
            <span className="home__banner-badge-indicator"></span>
            <span>Chương trình đào tạo thực chiến</span>
          </div>

          <h1 className="home__banner-title">
            Nâng tầm tri thức, bứt phá kỹ năng trong kỷ nguyên số
          </h1>

          <p className="home__banner-desc">
            Nền tảng học tập trực tuyến tương tác cao, kết hợp lý thuyết trọng tâm và thực hành dự án giúp bạn làm chủ công nghệ từ con số 0.
          </p>

          <div className="home__banner-actions">
            <Link to="/lo-trinh" className="btn-primary">
              <span>Đăng ký nhận lộ trình</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a href="#courses" className="btn-secondary">
              Xem danh sách khóa học
            </a>
          </div>
        </div>

        {/* Code Preview Studio */}
        <div className="home__banner-visual">
          <div className="code-preview">
            <div className="code-preview__header">
              <div className="code-preview__dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="code-preview__title">mentorship-session.ts</span>
            </div>
            <div className="code-preview__body">
              <div className="code-line">
                <span className="code-num">01</span>
                <span className="code-kw">interface</span> <span className="code-type">FullstackRoadmap</span> {'{'}
              </div>
              <div className="code-line">
                <span className="code-num">02</span>
                &nbsp;&nbsp;frontend: <span className="code-str">'React'</span> | <span className="code-str">'Next.js'</span>;
              </div>
              <div className="code-line">
                <span className="code-num">03</span>
                &nbsp;&nbsp;backend: <span className="code-str">'Node.js'</span> | <span className="code-str">'Express'</span>;
              </div>
              <div className="code-line">
                <span className="code-num">04</span>
                &nbsp;&nbsp;codeReview: <span className="code-bool">true</span>;
              </div>
              <div className="code-line">
                <span className="code-num">05</span>
                &nbsp;&nbsp;status: <span className="code-str">'Học đi đôi với hành'</span>;
              </div>
              <div className="code-line">
                <span className="code-num">06</span>
                {'}'}
              </div>
            </div>
            <div className="code-preview__footer">
              <div className="feature-item">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                <span>Review code trực tiếp</span>
              </div>
              <div className="feature-item">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                <span>Học trực tuyến qua video</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== KHÓA HỌC NỔI BẬT ===== */}
      <section className="home__section" id="courses">
        <div className="home__section-header">
          <div>
            <h2 className="home__section-title">Khóa học nổi bật</h2>
            <p className="home__section-subtitle">Lộ trình được thiết kế bài bản theo chuẩn yêu cầu doanh nghiệp</p>
          </div>
        </div>

        {loading ? (
          <div className="home__course-loading">Đang tải dữ liệu khóa học từ hệ thống...</div>
        ) : (
          <div className="home__course-grid">
            {(featuredCourses.length > 0 ? featuredCourses : courses.slice(0, 4)).map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </section>

      {/* ===== KHÓA HỌC MIỄN PHÍ ===== */}
      <section className="home__section">
        <div className="home__section-header">
          <div>
            <h2 className="home__section-title">Khóa học miễn phí</h2>
            <p className="home__section-subtitle">Xây dựng nền tảng vững chắc cho người mới bắt đầu</p>
          </div>
          <Link to="/lo-trinh" className="home__section-link">
            <span>Xem toàn bộ lộ trình</span>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="home__course-loading">Đang tải dữ liệu...</div>
        ) : (
          <div className="home__course-grid">
            {freeCourses.map((c) => (
              <CourseCard key={c.id} course={c} variant="free" />
            ))}
            {freeCourses.length === 0 && (
              <p className="home__empty-notice">Chưa có khóa học miễn phí nào.</p>
            )}
          </div>
        )}
      </section>

      {/* ===== KHÓA HỌC CÓ PHÍ (CHUYÊN SÂU) ===== */}
      <section className="home__section">
        <div className="home__section-header">
          <div>
            <h2 className="home__section-title">Khóa học chuyên sâu</h2>
            <p className="home__section-subtitle">Nâng cao kỹ năng kiến trúc hệ thống và công nghệ hiện đại</p>
          </div>
          <Link to="/lo-trinh" className="home__section-link">
            <span>Xem tất cả khóa Pro</span>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="home__course-loading">Đang tải dữ liệu...</div>
        ) : (
          <div className="home__course-grid">
            {paidCourses.map((c) => (
              <CourseCard key={c.id} course={c} variant="paid" />
            ))}
            {paidCourses.length === 0 && (
              <p className="home__empty-notice">Chưa có khóa học chuyên sâu nào.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
