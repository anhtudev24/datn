import React from 'react';
import './HomePage.css';

/* ===== DỮ LIỆU KHÓA HỌC ===== */
const recommendedCourses = [
  {
    id: 1,
    title: 'DevOps Nâng Cao',
    subtitle: 'Triển khai hạ tầng chuyên nghiệp với AWS',
    tag: 'AWS',
    accentColor: '#ff9900',
    isPro: true,
  },
  {
    id: 2,
    title: 'DevOps Cơ Bản',
    subtitle: 'Nền tảng CI/CD và Container hóa',
    tag: 'DevOps',
    accentColor: '#0db7ed',
    isPro: true,
  },
  {
    id: 3,
    title: 'PostgreSQL Chuyên Sâu',
    subtitle: 'Tối ưu truy vấn và thiết kế cơ sở dữ liệu lớn',
    tag: 'PostgreSQL',
    accentColor: '#336791',
    isPro: true,
  },
  {
    id: 4,
    title: 'MySQL Quản Trị',
    subtitle: 'Thiết kế cơ sở dữ liệu quan hệ cho backend',
    tag: 'MySQL',
    accentColor: '#00758f',
    isPro: true,
  },
];

const freeCourses = [
  {
    id: 10,
    title: 'HTML & CSS Cơ Bản',
    subtitle: 'Bắt đầu từ số 0 cho người mới lập trình web',
    tag: 'HTML/CSS',
    accentColor: '#e44d26',
    members: 185420,
    lessons: 166,
  },
  {
    id: 11,
    title: 'JavaScript Nền Tảng',
    subtitle: 'Cú pháp hiện đại ES6+, xử lý bất đồng bộ',
    tag: 'JavaScript',
    accentColor: '#d4b830',
    members: 142300,
    lessons: 204,
  },
  {
    id: 12,
    title: 'Responsive Web Design',
    subtitle: 'Xây dựng giao diện tương thích đa thiết bị',
    tag: 'CSS Grid/Flex',
    accentColor: '#2965f1',
    members: 67800,
    lessons: 48,
  },
  {
    id: 13,
    title: 'Git & GitHub Thực Chiến',
    subtitle: 'Quản lý phiên bản và quy trình làm việc nhóm',
    tag: 'Git',
    accentColor: '#f05033',
    members: 95600,
    lessons: 32,
  },
  {
    id: 14,
    title: 'Sass / SCSS Tiện Ích',
    subtitle: 'Viết CSS gọn gàng, có cấu trúc và dễ mở rộng',
    tag: 'Sass',
    accentColor: '#cf649a',
    members: 42100,
    lessons: 24,
  },
  {
    id: 15,
    title: 'React JS Nền Tảng',
    subtitle: 'Thư viện xây dựng giao diện người dùng hiện đại',
    tag: 'React',
    accentColor: '#0ea5e9',
    members: 128700,
    lessons: 136,
  },
  {
    id: 16,
    title: 'Node.js & ExpressJS',
    subtitle: 'Xây dựng API RESTful và kết nối cơ sở dữ liệu',
    tag: 'Node.js',
    accentColor: '#22c55e',
    members: 78500,
    lessons: 88,
  },
  {
    id: 17,
    title: 'TypeScript Cho Web',
    subtitle: 'Viết mã nguồn an toàn với hệ thống kiểu tĩnh',
    tag: 'TypeScript',
    accentColor: '#3178c6',
    members: 34200,
    lessons: 56,
  },
];

const paidCourses = [
  {
    id: 20,
    title: 'React.js Thực Chiến',
    subtitle: 'Xây dựng dự án quy mô lớn, tối ưu render',
    tag: 'React Pro',
    accentColor: '#0ea5e9',
    price: '1.299.000đ',
    oldPrice: '2.500.000đ',
  },
  {
    id: 21,
    title: 'Node.js Microservices',
    subtitle: 'Kiến trúc backend phân tán chịu tải cao',
    tag: 'Node Pro',
    accentColor: '#22c55e',
    price: '1.499.000đ',
    oldPrice: '2.800.000đ',
  },
  {
    id: 22,
    title: 'Next.js 15 Fullstack',
    subtitle: 'App Router, Server Components và Server Actions',
    tag: 'Next.js',
    accentColor: '#171717',
    price: '1.799.000đ',
    oldPrice: '3.200.000đ',
  },
  {
    id: 23,
    title: 'Docker & Kubernetes',
    subtitle: 'Đóng gói và điều phối container tự động',
    tag: 'DevOps',
    accentColor: '#0284c7',
    price: '999.000đ',
    oldPrice: '1.800.000đ',
  },
  {
    id: 24,
    title: 'MongoDB & Mongoose',
    subtitle: 'Thiết kế cơ sở dữ liệu tài liệu linh hoạt',
    tag: 'Database',
    accentColor: '#10b981',
    price: '899.000đ',
    oldPrice: '1.600.000đ',
  },
  {
    id: 25,
    title: 'Cloud AWS Thực Hành',
    subtitle: 'Triển khai EC2, S3, RDS và cấu hình VPC an toàn',
    tag: 'AWS',
    accentColor: '#f59e0b',
    price: '1.999.000đ',
    oldPrice: '3.500.000đ',
  },
  {
    id: 26,
    title: 'React Native Đa Nền Tảng',
    subtitle: 'Lập trình ứng dụng di động cho iOS và Android',
    tag: 'Mobile',
    accentColor: '#6366f1',
    price: '1.599.000đ',
    oldPrice: '2.900.000đ',
  },
  {
    id: 27,
    title: 'Thiết Kế Hệ Thống',
    subtitle: 'System Design cho kỹ sư phần mềm cao cấp',
    tag: 'Architecture',
    accentColor: '#8b5cf6',
    price: '2.199.000đ',
    oldPrice: '3.800.000đ',
  },
];

const formatNumber = (num) => num.toLocaleString('vi-VN');

const CourseCard = ({ course, variant = 'default' }) => (
  <div className="course-card">
    <div className="course-card__header">
      <div className="course-card__badge-row">
        <span
          className="course-card__tag"
          style={{
            borderColor: `${course.accentColor}40`,
            color: course.accentColor,
            backgroundColor: `${course.accentColor}12`,
          }}
        >
          {course.tag}
        </span>
        {course.isPro && <span className="course-card__pro-tag">Pro</span>}
      </div>
      <h3 className="course-card__title">{course.title}</h3>
      <p className="course-card__subtitle">{course.subtitle}</p>
    </div>

    <div className="course-card__footer">
      {variant === 'free' && (
        <div className="course-card__meta">
          <span className="course-card__meta-item">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            <span className="tabular-num">{formatNumber(course.members)}</span> học viên
          </span>
          <span className="course-card__meta-dot">•</span>
          <span className="course-card__meta-item">
            <span className="tabular-num">{course.lessons}</span> bài học
          </span>
        </div>
      )}

      {variant === 'paid' && (
        <div className="course-card__pricing">
          <span className="course-card__price tabular-num">{course.price}</span>
          <span className="course-card__old-price tabular-num">{course.oldPrice}</span>
        </div>
      )}

      {variant === 'default' && (
        <div className="course-card__action-hint">
          <span>Xem lộ trình</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  </div>
);

const HomePage = () => {
  return (
    <div className="home">
      {/* ===== HERO BANNER ===== */}
      <section className="home__banner">
        <div className="home__banner-content">
          <div className="home__banner-badge">
            <span className="home__banner-badge-indicator"></span>
            <span>Chương trình đào tạo thực tuyến</span>
          </div>

          <h1 className="home__banner-title">
            Nâng tầm tri thức, bứt phá kỹ năng trong kỷ nguyên số
          </h1>

          <p className="home__banner-desc">
            Nền tảng học tập trực tuyến tương tác cao, kết hợp lý thuyết trọng tâm và thực hành dự án giúp bạn làm chủ công nghệ từ con số 0.
          </p>

          <div className="home__banner-actions">
            <button className="btn-primary">
              <span>Đăng ký nhận lộ trình</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <a href="#courses" className="btn-secondary">
              Xem danh sách khóa học
            </a>
          </div>
        </div>

        {/* Console / Studio Preview (Real craft visual instead of AI floating blobs) */}
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

      {/* ===== KHÓA HỌC DÀNH CHO BẠN ===== */}
      <section className="home__section" id="courses">
        <div className="home__section-header">
          <div>
            <h2 className="home__section-title">Khóa học nổi bật</h2>
            <p className="home__section-subtitle">Lộ trình được thiết kế bài bản theo chuẩn yêu cầu doanh nghiệp</p>
          </div>
        </div>
        <div className="home__course-grid">
          {recommendedCourses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>

      {/* ===== KHÓA HỌC MIỄN PHÍ ===== */}
      <section className="home__section">
        <div className="home__section-header">
          <div>
            <h2 className="home__section-title">Khóa học miễn phí</h2>
            <p className="home__section-subtitle">Xây dựng nền tảng vững chắc cho người mới bắt đầu</p>
          </div>
          <a href="/lo-trinh" className="home__section-link">
            <span>Xem toàn bộ lộ trình</span>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        <div className="home__course-grid">
          {freeCourses.map((c) => (
            <CourseCard key={c.id} course={c} variant="free" />
          ))}
        </div>
      </section>

      {/* ===== KHÓA HỌC CÓ PHÍ (CHUYÊN SÂU) ===== */}
      <section className="home__section">
        <div className="home__section-header">
          <div>
            <h2 className="home__section-title">Khóa học chuyên sâu</h2>
            <p className="home__section-subtitle">Nâng cao kỹ năng kiến trúc hệ thống và công nghệ hiện đại</p>
          </div>
          <a href="/lo-trinh" className="home__section-link">
            <span>Xem tất cả khóa Pro</span>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        <div className="home__course-grid">
          {paidCourses.map((c) => (
            <CourseCard key={c.id} course={c} variant="paid" />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
