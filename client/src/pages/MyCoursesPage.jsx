import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './MyCourses.css';

const MyCoursesPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterTab, setFilterTab] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchEnrollments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/enrollments');
        setCourses(res.data || []);
      } catch (err) {
        console.error('Lỗi tải khóa học đã đăng ký:', err);
        setError('Không thể tải dữ liệu khóa học. Vui lòng thử lại sau.');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [isAuthenticated]);

  // Nếu chưa đăng nhập
  if (!isAuthenticated) {
    return (
      <div className="mycourses-page">
        <div className="mycourses-header">
          <div>
            <h1 className="mycourses-header__title">Khóa học của tôi</h1>
            <p className="mycourses-header__desc">
              Quản lý tiến độ học tập và tiếp tục các bài giảng của bạn mọi lúc mọi nơi.
            </p>
          </div>
        </div>

        <div className="mycourses-guest-card">
          <div className="mycourses-guest-icon">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h3>Đăng nhập để xem khóa học</h3>
          <p>
            Vui lòng đăng nhập vào tài khoản của bạn để đồng bộ tiến trình học tập, hoàn thành bài tập và nhận chứng chỉ.
          </p>
          <Link to="/login" className="mycourses-guest-btn">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  // Thống kê số liệu học tập
  const totalCount = courses.length;
  const completedCount = courses.filter((c) => c.status === 'completed' || Number(c.progress) >= 100).length;
  const inProgressCount = totalCount - completedCount;

  // Lọc theo tab & ô tìm kiếm
  const filteredCourses = courses.filter((c) => {
    const isCompleted = c.status === 'completed' || Number(c.progress) >= 100;
    if (filterTab === 'in_progress' && isCompleted) return false;
    if (filterTab === 'completed' && !isCompleted) return false;
    if (searchKeyword.trim()) {
      return c.title.toLowerCase().includes(searchKeyword.toLowerCase().trim());
    }
    return true;
  });

  return (
    <div className="mycourses-page">
      {/* 1. Header */}
      <div className="mycourses-header">
        <div>
          <h1 className="mycourses-header__title">Khóa học của tôi</h1>
          <p className="mycourses-header__desc">
            Chào mừng trở lại, <strong>{user?.name || 'Học viên'}</strong>! Hãy tiếp tục rèn luyện kỹ năng mỗi ngày.
          </p>
        </div>
      </div>

      {/* 2. Stats Overview Bar */}
      <div className="mycourses-stats-overview">
        <div className="overview-card">
          <div className="overview-card__icon overview-card__icon--total">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div className="overview-card__info">
            <span className="overview-card__val">{totalCount}</span>
            <span className="overview-card__lbl">Khóa học đã đăng ký</span>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-card__icon overview-card__icon--studying">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="overview-card__info">
            <span className="overview-card__val">{inProgressCount}</span>
            <span className="overview-card__lbl">Đang trong tiến trình học</span>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-card__icon overview-card__icon--done">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="overview-card__info">
            <span className="overview-card__val">{completedCount}</span>
            <span className="overview-card__lbl">Khóa học đã hoàn thành</span>
          </div>
        </div>
      </div>

      {/* 3. Controls (Tabs & Search) */}
      <div className="mycourses-controls">
        <div className="mycourses-tabs-group">
          <button
            type="button"
            className={`mycourses-tab-pill ${filterTab === 'all' ? 'active' : ''}`}
            onClick={() => setFilterTab('all')}
          >
            <span>Tất cả</span>
            <span className="tab-badge">{totalCount}</span>
          </button>
          <button
            type="button"
            className={`mycourses-tab-pill ${filterTab === 'in_progress' ? 'active' : ''}`}
            onClick={() => setFilterTab('in_progress')}
          >
            <span>Đang học</span>
            <span className="tab-badge">{inProgressCount}</span>
          </button>
          <button
            type="button"
            className={`mycourses-tab-pill ${filterTab === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterTab('completed')}
          >
            <span>Đã hoàn thành</span>
            <span className="tab-badge">{completedCount}</span>
          </button>
        </div>

        <div className="mycourses-search-box">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Tìm theo tên khóa học..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      {/* 4. State: Loading & Error */}
      {loading && (
        <div className="mycourses-loading-container">
          <div className="loading-spinner"></div>
          <p>Đang đồng bộ tiến trình học tập từ hệ thống...</p>
        </div>
      )}

      {!loading && error && (
        <div className="user-page-state user-page-state--error">{error}</div>
      )}

      {/* 5. State: Empty */}
      {!loading && !error && filteredCourses.length === 0 && (
        <div className="mycourses-empty">
          <div className="mycourses-empty__icon">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <h3>Chưa tìm thấy khóa học nào</h3>
          <p>
            {searchKeyword
              ? `Không có kết quả nào phù hợp với từ khóa "${searchKeyword}".`
              : 'Bạn chưa có khóa học nào trong danh mục này. Hãy khám phá ngay các chương trình đào tạo chuẩn doanh nghiệp.'}
          </p>
          <Link to="/" className="mycourses-empty__btn">
            Khám phá khóa học ngay
          </Link>
        </div>
      )}

      {/* 6. Course Grid */}
      {!loading && !error && filteredCourses.length > 0 && (
        <div className="mycourses-grid">
          {filteredCourses.map((c) => {
            const isDone = c.status === 'completed' || Number(c.progress) >= 100;
            const progressVal = Number(c.progress) || 0;

            return (
              <div key={c.id} className="mycourse-card">
                {/* Thumbnail */}
                <div className="mycourse-card__media">
                  {c.thumbnail ? (
                    <img src={c.thumbnail} alt={c.title} />
                  ) : (
                    <div className="mycourse-card__media-placeholder">
                      <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                      </svg>
                    </div>
                  )}

                  {isDone ? (
                    <span className="mycourse-card__badge-status badge-done">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Đã hoàn thành
                    </span>
                  ) : (
                    <span className="mycourse-card__badge-status badge-ongoing">
                      Đang học ({progressVal}%)
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="mycourse-card__content">
                  <h3 className="mycourse-card__title">
                    <Link to={`/courses/${c.slug}`}>{c.title}</Link>
                  </h3>
                  <p className="mycourse-card__author">{c.author || 'Edusmart'}</p>

                  {/* Progress info */}
                  <div className="mycourse-progress-section">
                    <div className="progress-info">
                      <span className="progress-info__lessons">
                        {c.completedLessons || Math.round((progressVal / 100) * (c.totalLessons || 20))}/
                        {c.totalLessons || 20} bài học
                      </span>
                      <span className={`progress-info__pct ${isDone ? 'done' : ''}`}>
                        {progressVal}%
                      </span>
                    </div>

                    <div className="progress-bar-track">
                      <div
                        className={`progress-bar-thumb ${isDone ? 'progress-bar-thumb--done' : ''}`}
                        style={{ width: `${progressVal}%` }}
                      />
                    </div>

                    <div className="progress-current-lesson">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="10 8 16 12 10 16 10 8" />
                      </svg>
                      <span>{c.currentLesson || 'Tiếp tục bài giảng gần nhất'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mycourse-card__actions">
                    {isDone && c.certificateCode ? (
                      <>
                        <button
                          type="button"
                          className="btn-mycourse btn-mycourse--cert"
                          onClick={() => setSelectedCert(c)}
                        >
                          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="8" r="6" />
                            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                          </svg>
                          Chứng chỉ
                        </button>
                        <Link to={`/learning/${c.slug}`} className="btn-mycourse btn-mycourse--outline">
                          Ôn lại bài
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to={`/learning/${c.slug}`} className="btn-mycourse btn-mycourse--primary">
                          <span>Tiếp tục học</span>
                          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 7. Modal Chứng chỉ điện tử */}
      {selectedCert && (
        <div className="modal-backdrop" onClick={() => setSelectedCert(null)}>
          <div className="cert-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cert-badge-ribbon">
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
              </svg>
            </div>
            <h3>Chứng chỉ hoàn thành khóa học</h3>
            <p className="cert-course-name">{selectedCert.title}</p>

            <div className="cert-code-box">
              <span>Mã xác thực chứng chỉ số:</span>
              <strong>{selectedCert.certificateCode}</strong>
            </div>

            <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 24px' }}>
              Chứng chỉ được xác thực vĩnh viễn trên hệ thống Edusmart, chứng nhận bạn đã hoàn thành 100% nội dung và bài kiểm tra thực chiến.
            </p>

            <button
              type="button"
              className="btn-mycourse btn-mycourse--primary"
              style={{ width: '100%' }}
              onClick={() => setSelectedCert(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
