import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './LearningPage.css';

const LearningPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bài học đang xem
  const [currentLesson, setCurrentLesson] = useState(null);
  // Trạng thái các section mở/đóng (mặc định mở tất cả)
  const [expandedSections, setExpandedSections] = useState({});
  // Danh sách các ID bài học đã hoàn thành của user
  const [completedLessonIds, setCompletedLessonIds] = useState(new Set());
  // Danh sách bài học đánh dấu bookmark
  const [bookmarkedLessonIds, setBookmarkedLessonIds] = useState(new Set());

  // Lưu thông tin enrollment
  const [enrollment, setEnrollment] = useState(null);

  const videoRef = useRef(null);

  // 1. Tải thông tin khóa học và các bài học
  useEffect(() => {
    let isMounted = true;

    const fetchCourseData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/courses/${slug}`);
        // Do axios interceptor returns response.data, res might be { success: true, data: {...} } or directly data
        const data = res?.data || res;
        if (!data || !data.title) throw new Error('Không có dữ liệu khóa học');

        if (isMounted) {
          setCourse(data);

          // Tạo trạng thái mở cho tất cả các chương
          const sectionsInit = {};
          data.sections?.forEach((sec) => {
            sectionsInit[sec.id] = true;
          });
          setExpandedSections(sectionsInit);

          // Lấy tất cả bài học phẳng
          const allLessons = [];
          data.sections?.forEach((sec) => {
            sec.lessons?.forEach((l) => allLessons.push(l));
          });

          // 2. Nếu đã đăng nhập, kiểm tra enrollment của khóa này
          let userEnrollment = null;
          if (isAuthenticated) {
            try {
              const enrollRes = await api.get('/enrollments');
              // enrollRes could be { success: true, data: [...] } or array directly
              const myEnrollments = Array.isArray(enrollRes) 
                ? enrollRes 
                : (enrollRes?.data || []);
              userEnrollment = myEnrollments.find(
                (e) => e.courseId === data.id || e.slug === slug
              );
              if (userEnrollment) {
                setEnrollment(userEnrollment);
              }
            } catch (err) {
              console.warn('Không thể lấy danh sách ghi danh:', err);
            }
          }

          // Chọn bài học mặc định:
          // Nếu có bài đang học dở (current_lesson_title) thì nhảy tới bài đó, ngược lại lấy bài đầu tiên
          let defaultLesson = allLessons[0];
          if (userEnrollment?.currentLesson) {
            const found = allLessons.find(
              (l) => l.title.trim().toLowerCase() === userEnrollment.currentLesson.trim().toLowerCase()
            );
            if (found) {
              defaultLesson = found;
            }
          }

          // Tính các bài đã hoàn thành tạm dựa vào tỉ lệ tiến độ
          const completedSet = new Set();
          if (userEnrollment && allLessons.length > 0) {
            const completedCount = Math.round((Number(userEnrollment.progress) / 100) * allLessons.length);
            for (let i = 0; i < completedCount && i < allLessons.length; i++) {
              completedSet.add(allLessons[i].id);
            }
          }
          setCompletedLessonIds(completedSet);
          setCurrentLesson(defaultLesson || null);
        }
      } catch (err) {
        console.error('Lỗi khi tải trang học:', err);
        if (isMounted) setError('Không thể tải khóa học hoặc khóa học không tồn tại.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCourseData();

    return () => {
      isMounted = false;
    };
  }, [slug, isAuthenticated]);

  // Cuộn lên đầu trang khi bài học thay đổi
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentLesson]);

  // Gom toàn bộ bài học theo mảng phẳng
  const allLessons = [];
  course?.sections?.forEach((sec) => {
    sec.lessons?.forEach((l) => allLessons.push(l));
  });

  const totalLessonsCount = allLessons.length;
  const completedCount = completedLessonIds.size;
  const progressPercent = totalLessonsCount > 0 
    ? Math.round((completedCount / totalLessonsCount) * 100)
    : (enrollment ? Number(enrollment.progress) : 0);

  // Tìm bài học tiếp theo (Gợi ý tiếp theo)
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);
  const nextLesson = currentIndex !== -1 && currentIndex + 1 < allLessons.length 
    ? allLessons[currentIndex + 1] 
    : null;

  // Toggle mở/đóng chương
  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Chọn bài học
  const handleSelectLesson = (lesson) => {
    setCurrentLesson(lesson);
    // Lưu lại tiến độ và cập nhật bài học gần nhất lên database nếu đã đăng nhập
    if (isAuthenticated && course?.id) {
      api.put('/enrollments/progress', {
        course_id: course.id,
        current_lesson_title: lesson.title,
        progress_percent: progressPercent,
      }).catch((e) => console.warn('Lỗi lưu bài học hiện tại:', e));
    }
  };

  // Đánh dấu hoàn thành bài học hiện tại và chuyển bài kế tiếp
  const handleCompleteAndNext = async () => {
    if (!currentLesson) return;

    const newCompleted = new Set(completedLessonIds);
    newCompleted.add(currentLesson.id);
    setCompletedLessonIds(newCompleted);

    const newProgress = totalLessonsCount > 0 
      ? Math.round((newCompleted.size / totalLessonsCount) * 100) 
      : 100;

    const targetLesson = nextLesson || currentLesson;

    if (isAuthenticated && course?.id) {
      try {
        await api.put('/enrollments/progress', {
          course_id: course.id,
          current_lesson_title: targetLesson.title,
          progress_percent: newProgress,
        });
      } catch (err) {
        console.error('Lỗi cập nhật tiến độ:', err);
      }
    }

    if (nextLesson) {
      setCurrentLesson(nextLesson);
    }
  };

  //Toggle đánh dấu bài học (Bookmark)
  const toggleBookmark = () => {
    if (!currentLesson) return;
    setBookmarkedLessonIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentLesson.id)) {
        next.delete(currentLesson.id);
      } else {
        next.add(currentLesson.id);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="learning-page-loading">
        <div className="spinner" />
        <p>Đang tải không gian học tập...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="learning-page-error">
        <h3>{error || 'Không tìm thấy dữ liệu khóa học'}</h3>
        <Link to="/khoa-hoc-cua-toi" className="learning-back-btn">
          Quay lại khóa học của tôi
        </Link>
      </div>
    );
  }

  // Hàm trích xuất YouTube Embed URL nếu link là YouTube
  const getEmbedUrl = (url) => {
    if (!url) return null;
    try {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else if (url.includes('watch?v=')) {
          videoId = url.split('watch?v=')[1]?.split('&')[0];
        } else if (url.includes('embed/')) {
          videoId = url.split('embed/')[1]?.split('?')[0];
        }
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
        }
      }
    } catch (e) {
      console.warn('Lỗi parse video url:', e);
    }
    return null;
  };

  const isCurrentBookmarked = currentLesson && bookmarkedLessonIds.has(currentLesson.id);
  const youtubeEmbedUrl = getEmbedUrl(currentLesson?.video_url);

  return (
    <div className="learning-layout">
      {/* ================= CỘT TRÁI: SIDEBAR BÀI HỌC ================= */}
      <aside className="learning-sidebar">
        {/* Course Card Header */}
        <div className="learning-sidebar__header">
          <div className="learning-sidebar__cover-box">
            <div className="learning-sidebar__icon-tag">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <div className="learning-sidebar__header-info">
              <h2 className="learning-sidebar__title" title={course.title}>
                {course.title}
              </h2>
              <div className="learning-sidebar__progress-bar">
                <div 
                  className="learning-sidebar__progress-fill" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
              <span className="learning-sidebar__pct-text">{progressPercent}% hoàn thành</span>
            </div>
          </div>
        </div>

        {/* Danh sách bài học Header */}
        <div className="learning-sidebar__content-title">
          <span>Danh sách bài học</span>
        </div>

        {/* Accordion các chương & bài học */}
        <div className="learning-curriculum">
          {course.sections?.map((section) => {
            const isExpanded = expandedSections[section.id];
            const sectionLessons = section.lessons || [];
            const secCompletedCount = sectionLessons.filter((l) => completedLessonIds.has(l.id)).length;

            return (
              <div key={section.id} className="learning-section-block">
                {/* Tiêu đề chương */}
                <button
                  type="button"
                  className="learning-section-header"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="learning-section-header__left">
                    <span className={`section-check-badge ${secCompletedCount === sectionLessons.length && sectionLessons.length > 0 ? 'done' : ''}`}>
                      {secCompletedCount === sectionLessons.length && sectionLessons.length > 0 ? (
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <span className="section-index-num">{section.id}</span>
                      )}
                    </span>
                    <span className="learning-section-title">{section.name}</span>
                  </div>

                  <div className="learning-section-header__right">
                    <span className="section-count-tag">
                      {secCompletedCount}/{sectionLessons.length}
                    </span>
                    <svg
                      className={`chevron-icon ${isExpanded ? 'open' : ''}`}
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {/* Danh sách bài học trong chương */}
                {isExpanded && (
                  <div className="learning-lessons-list">
                    {sectionLessons.map((lesson) => {
                      const isActive = currentLesson?.id === lesson.id;
                      const isDone = completedLessonIds.has(lesson.id);

                      return (
                        <div
                          key={lesson.id}
                          className={`learning-lesson-item ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                          onClick={() => handleSelectLesson(lesson)}
                        >
                          <div className="learning-lesson-item__left">
                            {isDone ? (
                              <span className="lesson-icon done">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </span>
                            ) : isActive ? (
                              <span className="lesson-icon playing">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                  <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                              </span>
                            ) : (
                              <span className="lesson-icon empty-circle" />
                            )}
                            <span className="lesson-title" title={lesson.title}>
                              {lesson.title}
                            </span>
                          </div>

                          <div className="learning-lesson-item__right">
                            {isActive ? (
                              <span className="badge-studying">Đang học</span>
                            ) : (
                              <span className="lesson-time">12:30</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Motivational Banner dưới cùng sidebar */}
        <div className="learning-sidebar__cheer">
          <div className="cheer-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#f59e0b" strokeWidth="2">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
              <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          </div>
          <div className="cheer-text">
            <strong>Cố gắng lên!</strong>
            <p>Bạn đã hoàn thành {progressPercent}% khóa học này.</p>
          </div>
        </div>
      </aside>

      {/* ================= CỘT GIỮA: VIDEO & TIÊU ĐỀ BÀI HỌC ================= */}
      <main className="learning-main">
        {/* Breadcrumb */}
        <nav className="learning-breadcrumb">
          <Link to="/khoa-hoc-cua-toi" className="breadcrumb-link home-link">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Khóa học</span>
          </Link>
          <span className="breadcrumb-separator">›</span>
          <Link to={`/courses/${course.slug}`} className="breadcrumb-link course-link">
            {course.title}
          </Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">
            {currentLesson?.title || 'Bài giảng'}
          </span>
        </nav>

        {/* Tiêu đề & Bookmark Header */}
        <div className="learning-header-bar">
          <div className="learning-header-bar__title-wrap">
            <h1 className="learning-lesson-headline">
              {currentLesson?.title || 'Đang chuẩn bị nội dung bài học...'}
            </h1>
            <p className="learning-lesson-subdesc">
              Trong bài học này, bạn sẽ nắm vững các khái niệm trọng tâm và ứng dụng trực tiếp vào dự án thực tế.
            </p>
          </div>

          <button
            type="button"
            className={`btn-bookmark-lesson ${isCurrentBookmarked ? 'bookmarked' : ''}`}
            onClick={toggleBookmark}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill={isCurrentBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
            <span>{isCurrentBookmarked ? 'Đã đánh dấu' : 'Đánh dấu bài học'}</span>
          </button>
        </div>

        {/* Video Player Box */}
        <div className="learning-video-container">
          <div className="learning-video-wrapper">
            {youtubeEmbedUrl ? (
              <iframe
                key={youtubeEmbedUrl}
                src={youtubeEmbedUrl}
                title={currentLesson.title}
                className="learning-video-element"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : currentLesson?.video_url ? (
              <video
                ref={videoRef}
                key={currentLesson.video_url}
                className="learning-video-element"
                controls
                autoPlay
                playsInline
                poster={course.thumbnail_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&q=80'}
              >
                <source src={currentLesson.video_url} type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ phát thẻ video HTML5.
              </video>
            ) : (
              <div className="learning-video-placeholder">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                <p>Bài học đang cập nhật video bài giảng.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer điều hướng Tiếp theo */}
        <div className="learning-main__footer-nav">
          <button
            type="button"
            className="btn-mark-completed"
            onClick={handleCompleteAndNext}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{nextLesson ? 'Hoàn thành & Sang bài tiếp theo' : 'Hoàn thành bài học'}</span>
          </button>

          {nextLesson && (
            <button
              type="button"
              className="btn-next-inline"
              onClick={() => handleSelectLesson(nextLesson)}
            >
              <span>Bài tiếp: {nextLesson.title}</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          )}
        </div>
      </main>

      {/* ================= CỘT PHẢI: TIẾN ĐỘ & GỢI Ý ================= */}
      <aside className="learning-rightbar">
        {/* Card Tiến độ khóa học */}
        <div className="learning-card learning-card--progress">
          <h3 className="learning-card__title">Tiến độ khóa học</h3>

          {/* Vòng tròn phần trăm SVG */}
          <div className="circle-progress-container">
            <svg className="circle-progress-svg" viewBox="0 0 120 120">
              <circle
                className="circle-bg"
                cx="60"
                cy="60"
                r="48"
                strokeWidth="10"
              />
              <circle
                className="circle-fill"
                cx="60"
                cy="60"
                r="48"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={2 * Math.PI * 48 * (1 - progressPercent / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="circle-progress-text">
              <span className="circle-pct-number">{progressPercent}%</span>
            </div>
          </div>

          <div className="learning-card__progress-stat">
            Hoàn thành {completedCount} / {totalLessonsCount} bài học
          </div>

          <button
            type="button"
            className="btn-continue-learning"
            onClick={handleCompleteAndNext}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>Tiếp tục học</span>
          </button>
        </div>

        {/* Card Gợi ý tiếp theo */}
        {nextLesson && (
          <div 
            className="learning-card learning-card--suggestion"
            onClick={() => handleSelectLesson(nextLesson)}
          >
            <div className="suggestion-icon">💡</div>
            <div className="suggestion-body">
              <span className="suggestion-label">Gợi ý tiếp theo</span>
              <p className="suggestion-title">
                Học tiếp bài: <strong>{nextLesson.title}</strong>
              </p>
            </div>
            <div className="suggestion-arrow">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default LearningPage;
