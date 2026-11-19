import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './CourseDetail.css';

const CourseDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Accordion mở/đóng các chương
  const [openSections, setOpenSections] = useState({});

  // Modal mua khóa học & modal thông báo
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState('VNPay');
  const [modalSuccess, setModalSuccess] = useState(null); // 'enrolled' | 'ordered'

  useEffect(() => {
    const fetchCourseDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/courses/${slug}`);
        if (res.data) {
          setCourse(res.data);
          // Mặc định mở chương 1
          if (res.data.sections && res.data.sections.length > 0) {
            setOpenSections({ [res.data.sections[0].id]: true });
          }
        } else {
          setError('Không tìm thấy thông tin khóa học');
        }
      } catch (err) {
        console.error('Lỗi khi tải khóa học:', err);
        setError(err.message || 'Không thể tải thông tin khóa học từ máy chủ');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [slug]);

  // Kiểm tra xem người dùng đã ghi danh khóa học này chưa
  useEffect(() => {
    if (!isAuthenticated || !course) return;

    const checkEnrollment = async () => {
      try {
        const res = await api.get('/enrollments');
        if (res.data && Array.isArray(res.data)) {
          const found = res.data.some(
            (e) => e.courseId === course.id || e.slug === course.slug
          );
          setIsEnrolled(found);
        }
      } catch (err) {
        // bỏ qua nếu lỗi
      }
    };

    checkEnrollment();
  }, [isAuthenticated, course]);

  const toggleSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAllSections = () => {
    if (!course || !course.sections) return;
    const allOpen = course.sections.every((s) => openSections[s.id]);
    const newState = {};
    course.sections.forEach((s) => {
      newState[s.id] = !allOpen;
    });
    setOpenSections(newState);
  };

  // Xử lý khi nhấn nút Đăng ký miễn phí / Mua khóa học
  const handlePrimaryAction = () => {
    if (!isAuthenticated) {
      // Điều hướng đăng nhập
      navigate('/login');
      return;
    }

    if (isEnrolled) {
      // Đã có khóa học -> chuyển vào trang Khóa học của tôi
      navigate('/khoa-hoc-cua-toi');
      return;
    }

    const price = Number(course?.price) || 0;
    if (price === 0) {
      // Khóa miễn phí -> Ghi danh ngay
      handleEnrollFree();
    } else {
      // Khóa có phí -> Mở modal chọn phương thức thanh toán
      setShowCheckoutModal(true);
    }
  };

  // Đăng ký khóa học miễn phí
  const handleEnrollFree = async () => {
    setActionLoading(true);
    try {
      const res = await api.post('/enrollments', { course_id: course.id });
      setIsEnrolled(true);
      setModalSuccess('enrolled');
    } catch (err) {
      alert(err.message || 'Đăng ký không thành công, vui lòng thử lại');
    } finally {
      setActionLoading(false);
    }
  };

  // Xác nhận thanh toán khóa học có phí
  const handleConfirmPurchase = async () => {
    setActionLoading(true);
    try {
      await api.post('/orders', {
        course_id: course.id,
        payment_gateway: selectedGateway,
      });
      setIsEnrolled(true);
      setShowCheckoutModal(false);
      setModalSuccess('ordered');
    } catch (err) {
      alert(err.message || 'Thanh toán không thành công, vui lòng thử lại');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="course-detail-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin khóa học...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-detail-error">
        <h2>Không thể hiển thị khóa học</h2>
        <p>{error || 'Khóa học không tồn tại hoặc đã bị gỡ bỏ.'}</p>
        <Link to="/" className="btn-back-home">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const priceNum = Number(course.price) || 0;
  const isFree = priceNum === 0;
  const totalLessons = course.total_lessons_count || (course.sections ? course.sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) : 0);
  const originalPriceNum = course.original_price ? Number(course.original_price) : (priceNum > 0 ? Math.round(priceNum * 1.5) : null);

  return (
    <div className="course-landing">
      {/* ===== HERO BANNER ===== */}
      <section className="course-hero">
        <div className="course-hero__container">
          <div className="course-hero__breadcrumbs">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <Link to="/lo-trinh">Khóa học</Link>
            <span>/</span>
            <span className="current">{course.title}</span>
          </div>

          <div className="course-hero__tags">
            <span className="badge-category">{course.category_name || 'Lập trình'}</span>
            {isFree ? (
              <span className="badge-free">Miễn phí</span>
            ) : (
              <span className="badge-pro">Chuyên sâu Pro</span>
            )}
            <span className="badge-level">Mọi cấp độ</span>
          </div>

          <h1 className="course-hero__title">{course.title}</h1>

          <p className="course-hero__desc">
            {course.description || 'Chương trình đào tạo thực chiến chuẩn doanh nghiệp, hướng dẫn từng bước từ nền tảng đến dự án quy mô lớn.'}
          </p>

          <div className="course-hero__meta">
            <div className="meta-item">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" color="#f59e0b">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span><strong>4.9</strong> (hơn 1.200 đánh giá)</span>
            </div>
            <span className="meta-dot">•</span>
            <div className="meta-item">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              <span><strong>{(course.students_count || 1250).toLocaleString('vi-VN')}</strong> học viên</span>
            </div>
            <span className="meta-dot">•</span>
            <div className="meta-item">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Thời lượng <strong>{course.duration || '40 giờ'}</strong></span>
            </div>
          </div>

          <div className="course-hero__instructor">
            <img
              src={course.instructor_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'}
              alt={course.instructor_name}
              className="instructor-avatar"
            />
            <div>
              <span className="instructor-label">Giảng viên hướng dẫn</span>
              <p className="instructor-name">{course.instructor_name || 'Học Lập Trình Để Đi Làm'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT LAYOUT (2 CỘT) ===== */}
      <div className="course-main-layout">
        {/* CỘT TRÁI: NỘI DUNG CHI TIẾT */}
        <div className="course-content-left">
          {/* 1. Bạn sẽ học được gì */}
          <section className="course-section-block">
            <h2 className="section-heading">Bạn sẽ học được những gì?</h2>
            <div className="learning-outcomes-grid">
              <div className="outcome-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#7c3aed" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Nắm vững kiến thức cốt lõi và tư duy lập trình chuẩn doanh nghiệp.</span>
              </div>
              <div className="outcome-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#7c3aed" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Tự tay xây dựng các dự án thực tế đưa trực tiếp vào hồ sơ CV ứng tuyển.</span>
              </div>
              <div className="outcome-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#7c3aed" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Học cách debug, tối ưu hóa hiệu năng render và xử lý bất đồng bộ.</span>
              </div>
              <div className="outcome-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#7c3aed" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Quy trình làm việc nhóm chuyên nghiệp với Git, GitHub và công cụ CI/CD.</span>
              </div>
            </div>
          </section>

          {/* 2. Nội dung khóa học (Giáo trình / Curriculum) */}
          <section className="course-section-block">
            <div className="curriculum-header">
              <div>
                <h2 className="section-heading" style={{ marginBottom: 4 }}>Nội dung khóa học</h2>
                <p className="curriculum-stats">
                  <strong>{course.sections ? course.sections.length : 1}</strong> chương • <strong>{totalLessons}</strong> bài học • Thời lượng <strong>{course.duration || '40 giờ'}</strong>
                </p>
              </div>
              <button
                type="button"
                className="btn-toggle-all"
                onClick={toggleAllSections}
              >
                Mở rộng / Thu gọn tất cả
              </button>
            </div>

            <div className="curriculum-list">
              {course.sections && course.sections.length > 0 ? (
                course.sections.map((section) => {
                  const isOpen = Boolean(openSections[section.id]);
                  const lessonCount = section.lessons ? section.lessons.length : 0;

                  return (
                    <div key={section.id} className={`curriculum-section ${isOpen ? 'is-open' : ''}`}>
                      <button
                        type="button"
                        className="curriculum-section__bar"
                        onClick={() => toggleSection(section.id)}
                      >
                        <div className="section-bar-left">
                          <span className="accordion-arrow">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </span>
                          <span className="section-title">{section.name}</span>
                        </div>
                        <span className="section-lesson-count">{lessonCount} bài học</span>
                      </button>

                      {isOpen && (
                        <div className="curriculum-lessons">
                          {section.lessons && section.lessons.length > 0 ? (
                            section.lessons.map((lesson, idx) => (
                              <div key={lesson.id} className="lesson-item">
                                <div className="lesson-left">
                                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" className="lesson-icon">
                                    <circle cx="12" cy="12" r="10" />
                                    <polygon points="10 8 16 12 10 16 10 8" />
                                  </svg>
                                  <span className="lesson-num">{idx + 1}.</span>
                                  <span className="lesson-title">{lesson.title}</span>
                                </div>
                                <div className="lesson-right">
                                  {lesson.is_free_preview && (
                                    <span className="badge-preview">Học thử</span>
                                  )}
                                  <span className="lesson-time">12:30</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="no-lessons">Chưa có bài học nào trong chương này.</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="curriculum-section is-open">
                  <div className="curriculum-section__bar">
                    <span className="section-title">Chương 1: Khởi động và kiến thức nền tảng</span>
                    <span className="section-lesson-count">Đang cập nhật bài giảng</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 3. Yêu cầu trước khi học */}
          <section className="course-section-block">
            <h2 className="section-heading">Yêu cầu khi tham gia khóa học</h2>
            <ul className="requirements-list">
              <li>Máy vi tính hoặc laptop kết nối Internet ổn định.</li>
              <li>Ý thức tự học cao, kiên trì thực hành và không ngại thử thách bản thân.</li>
              <li>Không yêu cầu kiến thức chuyên sâu từ trước, khóa học bắt đầu từ những khái niệm căn bản nhất.</li>
            </ul>
          </section>

          {/* 4. Giảng viên */}
          <section className="course-section-block">
            <h2 className="section-heading">Thông tin người hướng dẫn</h2>
            <div className="instructor-card">
              <img
                src={course.instructor_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80'}
                alt={course.instructor_name}
                className="instructor-card__avatar"
              />
              <div className="instructor-card__info">
                <h3 className="instructor-card__name">{course.instructor_name || 'Học Lập Trình Để Đi Làm'}</h3>
                <p className="instructor-card__role">Senior Technical Lead & Giảng viên đào tạo thực chiến</p>
                <p className="instructor-card__bio">
                  Hơn 8 năm kinh nghiệm trong ngành công nghiệp phần mềm, từng tham gia phát triển nhiều hệ thống phục vụ hàng triệu người dùng và đồng hành cùng hơn 180.000 học viên lập trình trên toàn quốc.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* CỘT PHẢI: FLOATING SIDEBAR MUA / GHI DANH */}
        <div className="course-sidebar-wrap">
          <div className="course-pricing-card">
            {/* Thumbnail Preview */}
            <div className="pricing-card__thumb">
              <img src={course.thumbnail_url} alt={course.title} />
              <div className="pricing-card__play-badge">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>

            {/* Price Box */}
            <div className="pricing-card__price-box">
              {isFree ? (
                <div className="price-free-box">
                  <span className="price-free-text">Miễn phí</span>
                  <span className="price-free-sub">Truy cập trọn đời • Học ngay hôm nay</span>
                </div>
              ) : (
                <div className="price-paid-box">
                  <div className="price-paid-main">
                    <span className="price-current">{priceNum.toLocaleString('vi-VN')}đ</span>
                    {originalPriceNum && (
                      <span className="price-original">{originalPriceNum.toLocaleString('vi-VN')}đ</span>
                    )}
                  </div>
                  <span className="price-discount-tag">Tiết kiệm 35%</span>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <div className="pricing-card__cta">
              <button
                type="button"
                className={`btn-landing-cta ${isEnrolled ? 'btn-enrolled' : isFree ? 'btn-free' : 'btn-buy'}`}
                onClick={handlePrimaryAction}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <span>Đang xử lý...</span>
                ) : isEnrolled ? (
                  <span>Vào học ngay →</span>
                ) : isFree ? (
                  <span>Đăng ký học miễn phí</span>
                ) : (
                  <span>Mua khóa học ngay ({priceNum.toLocaleString('vi-VN')}đ)</span>
                )}
              </button>
            </div>

            {/* Lợi ích khi tham gia */}
            <div className="pricing-card__features">
              <h4 className="features-title">Khóa học này bao gồm:</h4>
              <ul className="features-list">
                <li>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                  <span>Quyền truy cập toàn bộ bài học trọn đời</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  <span>Học mọi lúc mọi nơi trên Desktop & Mobile</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                  <span>Cấp chứng chỉ điện tử sau khi hoàn thành</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  <span>Hỗ trợ giải đáp bài tập 1-1 từ Mentor</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      

      {/* ===== MODAL THANH TOÁN (CHO KHÓA CÓ PHÍ) ===== */}
      {showCheckoutModal && (
        <div className="modal-backdrop" onClick={() => setShowCheckoutModal(false)}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="checkout-modal__header">
              <h3>Thanh toán khóa học</h3>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setShowCheckoutModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="checkout-modal__body">
              <div className="checkout-summary">
                <img src={course.thumbnail_url} alt={course.title} className="checkout-thumb" />
                <div>
                  <h4 className="checkout-title">{course.title}</h4>
                  <p className="checkout-author">Giảng viên: {course.instructor_name || 'Edusmart'}</p>
                  <p className="checkout-amount">{priceNum.toLocaleString('vi-VN')} đ</p>
                </div>
              </div>

              <div className="checkout-gateways">
                <label className="gateway-label">Chọn phương thức thanh toán:</label>
                <div className="gateways-options">
                  <label className={`gateway-option ${selectedGateway === 'VNPay' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="gateway"
                      value="VNPay"
                      checked={selectedGateway === 'VNPay'}
                      onChange={() => setSelectedGateway('VNPay')}
                    />
                    <span>VNPay QR (Quét mã ngân hàng)</span>
                  </label>
                  <label className={`gateway-option ${selectedGateway === 'Momo' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="gateway"
                      value="Momo"
                      checked={selectedGateway === 'Momo'}
                      onChange={() => setSelectedGateway('Momo')}
                    />
                    <span>Ví điện tử MoMo</span>
                  </label>
                  <label className={`gateway-option ${selectedGateway === 'Chuyển khoản' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="gateway"
                      value="Chuyển khoản"
                      checked={selectedGateway === 'Chuyển khoản'}
                      onChange={() => setSelectedGateway('Chuyển khoản')}
                    />
                    <span>Chuyển khoản trực tiếp (Vietcombank)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="checkout-modal__footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowCheckoutModal(false)}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className="btn-confirm-pay"
                onClick={handleConfirmPurchase}
                disabled={actionLoading}
              >
                {actionLoading ? 'Đang kích hoạt...' : 'Xác nhận thanh toán ngay'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL THÔNG BÁO THÀNH CÔNG ===== */}
      {modalSuccess && (
        <div className="modal-backdrop">
          <div className="success-modal">
            <div className="success-icon-wrap">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#16a34a" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3>
              {modalSuccess === 'enrolled'
                ? 'Đăng ký khóa học thành công!'
                : 'Thanh toán & Kích hoạt thành công!'}
            </h3>
            <p>
              Khóa học <strong>"{course.title}"</strong> đã được thêm vào danh sách bài học của bạn.
            </p>
            <div className="success-modal-actions">
              <button
                type="button"
                className="btn-view-courses"
                onClick={() => navigate(`/learning/${course.slug}`)}
              >
                Vào học ngay bây giờ
              </button>
              <button
                type="button"
                className="btn-stay"
                onClick={() => setModalSuccess(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;
