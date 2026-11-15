import React from 'react';
import './HomePage.css';

/* ===== DỮ LIỆU MẪU ===== */
const recommendedCourses = [
  { id: 1, title: 'DevOps Nâng Cao', subtitle: 'Nâng cao với AWS', tag: 'AWS', bgColor: 'linear-gradient(135deg, #1a4a5e, #0d3040)', textColor: '#fff', isPro: true },
  { id: 2, title: 'DevOps Cơ Bản', subtitle: 'Cơ bản với AWS', tag: 'AWS', bgColor: 'linear-gradient(135deg, #1a5e4a, #0d4030)', textColor: '#fff', isPro: true },
  { id: 3, title: 'PostgreSQL', subtitle: 'Chuyên sâu cho backend', tag: 'PG', bgColor: 'linear-gradient(135deg, #c44530, #a03020)', textColor: '#fff', isPro: true },
  { id: 4, title: 'MySQL', subtitle: 'Chuyên sâu cho backend', tag: 'SQL', bgColor: 'linear-gradient(135deg, #2a6a5a, #1a5040)', textColor: '#fff', isPro: true },
];

const freeCourses = [
  { id: 10, title: 'HTML & CSS', subtitle: 'Cơ bản cho người mới', tag: 'Web', bgColor: 'linear-gradient(135deg, #e44d26, #c73e1d)', textColor: '#fff', members: 185420, lessons: 166 },
  { id: 11, title: 'JavaScript', subtitle: 'Nền tảng lập trình web', tag: 'JS', bgColor: 'linear-gradient(135deg, #f0db4f, #d4b830)', textColor: '#323330', members: 142300, lessons: 204 },
  { id: 12, title: 'Responsive Web', subtitle: 'Giao diện đa thiết bị', tag: 'CSS', bgColor: 'linear-gradient(135deg, #2965f1, #1d4ed8)', textColor: '#fff', members: 67800, lessons: 48 },
  { id: 13, title: 'Git & GitHub', subtitle: 'Quản lý mã nguồn', tag: 'Git', bgColor: 'linear-gradient(135deg, #f05033, #cc3d22)', textColor: '#fff', members: 95600, lessons: 32 },
  { id: 14, title: 'Sass / SCSS', subtitle: 'CSS nâng cao', tag: 'Sass', bgColor: 'linear-gradient(135deg, #cf649a, #b54e82)', textColor: '#fff', members: 42100, lessons: 24 },
  { id: 15, title: 'React JS Cơ Bản', subtitle: 'Thư viện UI phổ biến', tag: 'React', bgColor: 'linear-gradient(135deg, #282c34, #3a3f47)', textColor: '#61dafb', members: 128700, lessons: 136 },
  { id: 16, title: 'Node & ExpressJS', subtitle: 'Backend cơ bản', tag: 'Node', bgColor: 'linear-gradient(135deg, #3c873a, #2d6b2a)', textColor: '#fff', members: 78500, lessons: 88 },
  { id: 17, title: 'TypeScript', subtitle: 'JavaScript có kiểu dữ liệu', tag: 'TS', bgColor: 'linear-gradient(135deg, #3178c6, #2563a8)', textColor: '#fff', members: 34200, lessons: 56 },
];

const paidCourses = [
  { id: 20, title: 'React Pro', subtitle: 'Nâng cao & thực chiến', tag: 'React', bgColor: 'linear-gradient(135deg, #0f172a, #1e293b)', textColor: '#61dafb', price: '1.299.000đ', oldPrice: '2.500.000đ' },
  { id: 21, title: 'Node.js Pro', subtitle: 'Xây dựng hệ thống lớn', tag: 'Node', bgColor: 'linear-gradient(135deg, #14532d, #166534)', textColor: '#4ade80', price: '1.499.000đ', oldPrice: '2.800.000đ' },
  { id: 22, title: 'Next.js Fullstack', subtitle: 'SSR, SSG & API Routes', tag: 'Next', bgColor: 'linear-gradient(135deg, #000000, #1a1a2e)', textColor: '#fff', price: '1.799.000đ', oldPrice: '3.200.000đ' },
  { id: 23, title: 'Docker & CI/CD', subtitle: 'DevOps thực chiến', tag: 'DevOps', bgColor: 'linear-gradient(135deg, #0db7ed, #0991c4)', textColor: '#fff', price: '999.000đ', oldPrice: '1.800.000đ' },
  { id: 24, title: 'MongoDB', subtitle: 'NoSQL cho backend', tag: 'DB', bgColor: 'linear-gradient(135deg, #00684a, #005c3f)', textColor: '#00ed64', price: '899.000đ', oldPrice: '1.600.000đ' },
  { id: 25, title: 'AWS Cloud', subtitle: 'Triển khai hạ tầng đám mây', tag: 'AWS', bgColor: 'linear-gradient(135deg, #232f3e, #374151)', textColor: '#ff9900', price: '1.999.000đ', oldPrice: '3.500.000đ' },
  { id: 26, title: 'React Native', subtitle: 'Ứng dụng mobile đa nền tảng', tag: 'Mobile', bgColor: 'linear-gradient(135deg, #282c34, #20232a)', textColor: '#61dafb', price: '1.599.000đ', oldPrice: '2.900.000đ' },
  { id: 27, title: 'System Design', subtitle: 'Thiết kế hệ thống quy mô', tag: 'Design', bgColor: 'linear-gradient(135deg, #4c1d95, #5b21b6)', textColor: '#c4b5fd', price: '2.199.000đ', oldPrice: '3.800.000đ' },
];

const formatNumber = (num) => num.toLocaleString('vi-VN');

const CourseCard = ({ course, variant = 'default' }) => (
  <div className="course-card">
    <div className="course-card__thumb" style={{ background: course.bgColor }}>
      {course.isPro && <span className="course-card__pro-badge">👑</span>}
      <span className="course-card__tag">• {course.tag}</span>
      <h3 className="course-card__title" style={{ color: course.textColor }}>{course.title}</h3>
      <p className="course-card__subtitle" style={{ color: course.textColor, opacity: 0.8 }}>{course.subtitle}</p>
    </div>
    <div className="course-card__info">
      <p className="course-card__name">{course.title}</p>
      {variant === 'free' && (
        <div className="course-card__meta">
          <span>{formatNumber(course.members)} học viên</span>
          <span>•</span>
          <span>{course.lessons} bài học</span>
        </div>
      )}
      {variant === 'paid' && (
        <div className="course-card__pricing">
          <span className="course-card__price">{course.price}</span>
          <span className="course-card__old-price">{course.oldPrice}</span>
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
            <span className="home__banner-badge-dot">●</span>
            <span>HỌC ONLINE</span>
          </div>
          <h1 className="home__banner-title">
            Học lập trình Fullstack <span className="emoji">🎓</span>
          </h1>
          <p className="home__banner-desc">
            Học online trực tuyến, phù hợp nếu bạn muốn được review code, chấm bài trực tiếp bởi giảng viên
            và trợ giảng giàu kinh nghiệm. Giờ học linh hoạt, phù hợp cả sinh viên và người đi làm.
          </p>
          <button className="home__banner-btn">
            NHẬN LỘ TRÌNH
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="home__banner-visual">
          <div className="home__banner-card">
            <span>📺</span>
            <p>Học live qua Zoom</p>
          </div>
          <div className="home__banner-card">
            <span>💻</span>
            <p>Review code trực tiếp</p>
          </div>
          <div className="home__banner-card">
            <span>🕐</span>
            <p>Linh hoạt cho người đi làm</p>
          </div>
          <div className="home__banner-card">
            <span>🤝</span>
            <p>Trợ giảng hỗ trợ</p>
          </div>
        </div>
      </section>

      {/* ===== DÀNH CHO BẠN ===== */}
      <section className="home__section">
        <h2 className="home__section-title">Dành cho bạn</h2>
        <div className="home__course-grid">
          {recommendedCourses.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      </section>

      {/* ===== KHÓA HỌC MIỄN PHÍ ===== */}
      <section className="home__section">
        <div className="home__section-header">
          <h2 className="home__section-title">
            Khóa học miễn phí
            <span className="home__section-title-badge home__section-title-badge--free">Miễn phí</span>
          </h2>
          <a href="/lo-trinh" className="home__section-viewall">
            Xem lộ trình
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </a>
        </div>
        <div className="home__course-grid">
          {freeCourses.map((c) => <CourseCard key={c.id} course={c} variant="free" />)}
        </div>
      </section>

      {/* ===== KHÓA HỌC CÓ PHÍ ===== */}
      <section className="home__section">
        <div className="home__section-header">
          <h2 className="home__section-title">
            Khóa học có phí
            <span className="home__section-title-badge home__section-title-badge--pro">Pro</span>
          </h2>
          <a href="/lo-trinh" className="home__section-viewall">
            Xem tất cả
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </a>
        </div>
        <div className="home__course-grid">
          {paidCourses.map((c) => <CourseCard key={c.id} course={c} variant="paid" />)}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
