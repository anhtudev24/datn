import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './MyCourses.css';

const ENROLLED_COURSES = [
  {
    id: 1,
    title: 'Lập trình Fullstack Web Developer Chuyên Nghiệp',
    author: 'Sơn Đặng',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
    progress: 68,
    completedLessons: 46,
    totalLessons: 68,
    currentLesson: 'Bài 47: Tích hợp xác thực JWT & Cookie Refresh Token',
    status: 'in_progress',
  },
  {
    id: 2,
    title: 'Xây dựng RESTful API với Node.js, Express & MongoDB',
    author: 'Minh Quân',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
    progress: 35,
    completedLessons: 14,
    totalLessons: 40,
    currentLesson: 'Bài 15: Thiết kế schema với Mongoose & Quan hệ dữ liệu',
    status: 'in_progress',
  },
  {
    id: 3,
    title: 'Lập trình JavaScript Nâng Cao (ES6+ & Asynchronous)',
    author: 'Sơn Đặng',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&q=80',
    progress: 100,
    completedLessons: 32,
    totalLessons: 32,
    currentLesson: 'Đã hoàn thành toàn bộ khóa học',
    status: 'completed',
  },
];

const MyCoursesPage = () => {
  const { isAuthenticated } = useAuth();
  const [filterTab, setFilterTab] = useState('all');

  // Nếu chưa đăng nhập, hiển thị thông báo yêu cầu đăng nhập
  if (!isAuthenticated) {
    return (
      <div className="mycourses-page">
        <div className="mycourses-header">
          <h1 className="mycourses-header__title">Khóa học của tôi</h1>
          <p className="mycourses-header__desc">Theo dõi tiến độ và tiếp tục các bài học đang dang dở của bạn.</p>
        </div>

        <div className="mycourses-guest-card">
          <div className="mycourses-guest-icon">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="mycourses-guest-title">Bạn chưa đăng nhập</h2>
          <p className="mycourses-guest-desc">
            Vui lòng đăng nhập vào tài khoản của bạn để xem danh sách khóa học đã đăng ký và tiếp tục tiến trình học tập.
          </p>
          <Link to="/login" className="mycourses-btn-login">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  // Lọc khóa học theo tab
  const filteredCourses = ENROLLED_COURSES.filter((course) => {
    if (filterTab === 'in_progress') return course.status === 'in_progress';
    if (filterTab === 'completed') return course.status === 'completed';
    return true;
  });

  return (
    <div className="mycourses-page">
      {/* Header */}
      <div className="mycourses-header">
        <h1 className="mycourses-header__title">Khóa học của tôi</h1>
        <p className="mycourses-header__desc">Theo dõi tiến trình và tiếp tục các bài học đang dang dở của bạn.</p>
      </div>

      {/* Thanh thống kê nhanh */}
      <div className="mycourses-stats-bar">
        <div className="mycourses-stat-item">
          <span className="mycourses-stat-num">3</span>
          <span className="mycourses-stat-label">Khóa học đã tham gia</span>
        </div>
        <span className="mycourses-stat-divider"></span>
        <div className="mycourses-stat-item">
          <span className="mycourses-stat-num">2</span>
          <span className="mycourses-stat-label">Đang học</span>
        </div>
        <span className="mycourses-stat-divider"></span>
        <div className="mycourses-stat-item">
          <span className="mycourses-stat-num">1</span>
          <span className="mycourses-stat-label">Đã hoàn thành</span>
        </div>
      </div>

      {/* Tabs lọc */}
      <div className="mycourses-tabs">
        <button
          type="button"
          className={`mycourses-tab ${filterTab === 'all' ? 'active' : ''}`}
          onClick={() => setFilterTab('all')}
        >
          Tất cả (3)
        </button>
        <button
          type="button"
          className={`mycourses-tab ${filterTab === 'in_progress' ? 'active' : ''}`}
          onClick={() => setFilterTab('in_progress')}
        >
          Đang học (2)
        </button>
        <button
          type="button"
          className={`mycourses-tab ${filterTab === 'completed' ? 'active' : ''}`}
          onClick={() => setFilterTab('completed')}
        >
          Đã hoàn thành (1)
        </button>
      </div>

      {/* Grid danh sách khóa học */}
      <div className="mycourses-grid">
        {filteredCourses.map((course) => (
          <div key={course.id} className="mycourse-card">
            <div className="mycourse-card__thumb-wrap">
              <img src={course.thumbnail} alt={course.title} className="mycourse-card__thumb" />
              {course.status === 'completed' && (
                <span className="mycourse-badge-completed">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Đã hoàn thành
                </span>
              )}
            </div>

            <div className="mycourse-card__body">
              <div>
                <h3 className="mycourse-card__title">{course.title}</h3>
                <p className="mycourse-card__author">Giảng viên: {course.author}</p>

                {/* Thanh tiến độ */}
                <div className="mycourse-progress-wrap">
                  <div className="mycourse-progress-header">
                    <span>Tiến độ: <strong>{course.progress}%</strong></span>
                    <span>{course.completedLessons}/{course.totalLessons} bài học</span>
                  </div>
                  <div className="mycourse-progress-bar">
                    <div
                      className={`mycourse-progress-fill ${course.status === 'completed' ? 'mycourse-progress-fill--done' : ''}`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mycourse-current-lesson" title={course.currentLesson}>
                  {course.status === 'completed' ? '🎉 Bạn đã nhận được chứng chỉ' : `📍 ${course.currentLesson}`}
                </div>
              </div>

              <div className="mycourse-card__action">
                {course.status === 'completed' ? (
                  <Link to="/" className="mycourse-btn-review">
                    Ôn tập lại
                  </Link>
                ) : (
                  <Link to="/" className="mycourse-btn-continue">
                    <span>Tiếp tục học</span>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCoursesPage;
