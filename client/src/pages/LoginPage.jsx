import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Xác định chế độ dựa vào URL hiện tại (/register hay /login)
  const isRegister = location.pathname === '/register';

  // State chung
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [successModal, setSuccessModal] = useState(false);

  // Form Đăng nhập
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Form Đăng ký
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Reset alert khi chuyển tab
  useEffect(() => {
    setAlert(null);
  }, [location.pathname]);

  const handleTabSwitch = (mode) => {
    if (mode === 'register' && !isRegister) {
      navigate('/register');
    } else if (mode === 'login' && isRegister) {
      navigate('/login');
    }
  };

  // Xử lý submit Đăng nhập
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email: loginEmail.trim(),
        password: loginPassword,
      });

      const userObj = res.data?.user || {
        id: 1,
        name: 'Anh Tú',
        email: loginEmail.trim(),
        username: `@${loginEmail.split('@')[0]}`,
      };

      login(res.data?.token || 'sample_jwt_token', userObj);
      setSuccessModal('login');
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Email hoặc mật khẩu không chính xác, vui lòng thử lại',
      });
    } finally {
      setLoading(false);
    }
  };

  // Xử lý submit Đăng ký
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (regPassword.length < 6) {
      setAlert({
        type: 'error',
        message: 'Mật khẩu cần tối thiểu 6 ký tự',
      });
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setAlert({
        type: 'error',
        message: 'Mật khẩu xác nhận không khớp, vui lòng kiểm tra lại',
      });
      return;
    }

    if (!agreeTerms) {
      setAlert({
        type: 'error',
        message: 'Vui lòng đồng ý với điều khoản sử dụng hệ thống',
      });
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', {
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
      });

      setSuccessModal('register');
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Đăng ký tài khoản không thành công, vui lòng thử lại',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Topbar điều hướng */}
      <header className="auth-topbar">
        <Link to="/" className="auth-topbar__brand">
          <div className="auth-topbar__logo">E</div>
          <span className="auth-topbar__name">Biến đam mê thành sự nghiệp</span>
        </Link>
        <Link to="/" className="auth-topbar__back">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Về trang chủ</span>
        </Link>
      </header>

      <div className="auth-container">
        {/* CỘT TRÁI: SHOWCASE GIỚI THIỆU THỰC TẾ */}
        <section className="auth-showcase">
          <div className="auth-showcase__content">
            <div className="auth-showcase__badge">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{isRegister ? 'Gia nhập cộng đồng' : 'Lộ trình thực chiến'}</span>
            </div>

            <h1 className="auth-showcase__title">
              {isRegister ? (
                <>Khởi đầu sự nghiệp lập trình <em>chuyên nghiệp</em> từ hôm nay</>
              ) : (
                <>Nâng cao kỹ năng lập trình <em>thực chiến</em> cùng chuyên gia</>
              )}
            </h1>
            <p className="auth-showcase__desc">
              {isRegister
                ? 'Tham gia cùng hơn 185.000 học viên. Lộ trình bài bản từ con số 0, code thực chiến theo tiêu chuẩn doanh nghiệp và hỗ trợ giải đáp kỹ thuật tận tâm.'
                : 'Hệ thống học tập định hướng nghề nghiệp, review mã nguồn trực tiếp và đồng hành cùng bạn từ nền tảng đến dự án quy mô doanh nghiệp.'}
            </p>

            {/* Mô phỏng Terminal thật (Real Product Preview) */}
            <div className="auth-preview-terminal">
              <div className="auth-preview-terminal__header">
                <span className="auth-terminal-dot"></span>
                <span className="auth-terminal-dot"></span>
                <span className="auth-terminal-dot"></span>
                <span className="auth-terminal-title">{isRegister ? 'new-student.ts' : 'career-roadmap.ts'}</span>
              </div>
              <div className="auth-preview-terminal__body">
                <div className="auth-code-line">
                  <span className="auth-code-num">1</span>
                  <span className="auth-code-text">
                    <span className="auth-code-keyword">import</span> &#123; {isRegister ? 'DeveloperJourney' : 'createCareer'} &#125; <span className="auth-code-keyword">from</span> <span className="auth-code-string">'@edusmart/academy'</span>;
                  </span>
                </div>
                <div className="auth-code-line">
                  <span className="auth-code-num">2</span>
                  <span className="auth-code-text">
                    <span className="auth-code-comment">{isRegister ? '// Khởi tạo hồ sơ học viên mới' : '// Khởi tạo lộ trình thực chiến chuẩn doanh nghiệp'}</span>
                  </span>
                </div>
                <div className="auth-code-line">
                  <span className="auth-code-num">3</span>
                  <span className="auth-code-text">
                    <span className="auth-code-keyword">const</span> track = <span className="auth-code-keyword">await</span> <span className="auth-code-fn">{isRegister ? 'createProfile' : 'createCareer'}</span>(&#123; goal: <span className="auth-code-string">'Fullstack Developer'</span> &#125;);
                  </span>
                </div>
                <div className="auth-code-line">
                  <span className="auth-code-num">4</span>
                  <span className="auth-code-text">
                    <span className="auth-code-keyword">await</span> track.<span className="auth-code-fn">buildProductionProject</span>();
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-showcase__footer">
            <div className="auth-stat-item">
              <span className="auth-stat-num">185.000+</span>
              <span className="auth-stat-label">Học viên đang học tập</span>
            </div>
            <div className="auth-stat-item">
              <span className="auth-stat-num">50+</span>
              <span className="auth-stat-label">Khóa học cập nhật 2026</span>
            </div>
            <div className="auth-stat-item">
              <span className="auth-stat-num">98%</span>
              <span className="auth-stat-label">Tỷ lệ hoàn thành mục tiêu</span>
            </div>
          </div>
        </section>

        {/* CỘT PHẢI: FORM ĐĂNG NHẬP / ĐĂNG KÝ */}
        <section className="auth-form-panel">
          <div className="auth-card">
            <div className="auth-card__header">
              <h2 className="auth-card__title">
                {isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}
              </h2>
              <p className="auth-card__subtitle">
                {isRegister
                  ? 'Đăng ký để lưu tiến trình và nhận chứng chỉ hoàn thành'
                  : 'Chào mừng bạn quay lại với hệ thống học tập'}
              </p>
            </div>

            {/* Tab chuyển đổi Đăng nhập / Đăng ký với thanh trượt màu cam mượt mà */}
            <div className="auth-tabs" data-tab={isRegister ? 'register' : 'login'}>
              <div className="auth-tab-slider"></div>
              <button
                type="button"
                className={`auth-tab-btn ${!isRegister ? 'active' : ''}`}
                onClick={() => handleTabSwitch('login')}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${isRegister ? 'active' : ''}`}
                onClick={() => handleTabSwitch('register')}
              >
                Đăng ký
              </button>
            </div>

            {/* Thông báo lỗi */}
            {alert && (
              <div className={`auth-alert auth-alert--${alert.type}`}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{alert.message}</span>
              </div>
            )}

            {/* FORM ĐĂNG NHẬP */}
            {!isRegister ? (
              <form key="login-form" className="auth-form-animated" onSubmit={handleLoginSubmit} autoComplete="off">
                <div className="auth-form-group">
                  <label className="auth-form-label" htmlFor="loginEmail">Email hoặc tài khoản</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    <input
                      id="loginEmail"
                      type="email"
                      className="auth-input"
                      placeholder="name@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <div className="auth-form-label-row">
                    <label className="auth-form-label" htmlFor="loginPass">Mật khẩu</label>
                    <a href="#forgot" className="auth-forgot-link" onClick={(e) => e.preventDefault()}>
                      Quên mật khẩu?
                    </a>
                  </div>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="loginPass"
                      type={showLoginPassword ? 'text' : 'password'}
                      className="auth-input"
                      placeholder="Nhập mật khẩu"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="auth-eye-btn"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      aria-label="Toggle password"
                    >
                      {showLoginPassword ? (
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <label className="auth-checkbox-row">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="auth-checkbox-text">Ghi nhớ trạng thái đăng nhập</span>
                </label>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  <span>{loading ? 'Đang xác thực...' : 'Đăng nhập vào tài khoản'}</span>
                  {!loading && (
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  )}
                </button>
              </form>
            ) : (
              /* FORM ĐĂNG KÝ */
              <form key="register-form" className="auth-form-animated" onSubmit={handleRegisterSubmit} autoComplete="off">
                <div className="auth-form-group">
                  <label className="auth-form-label" htmlFor="registerName">Họ và tên</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <input
                      id="registerName"
                      type="text"
                      className="auth-input"
                      placeholder="Nguyễn Văn A"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label className="auth-form-label" htmlFor="registerEmail">Địa chỉ Email</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    <input
                      id="registerEmail"
                      type="email"
                      className="auth-input"
                      placeholder="name@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label className="auth-form-label" htmlFor="registerPass">Mật khẩu</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="registerPass"
                      type={showRegPassword ? 'text' : 'password'}
                      className="auth-input"
                      placeholder="Tối thiểu 6 ký tự"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="auth-eye-btn"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      aria-label="Toggle password"
                    >
                      {showRegPassword ? (
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="auth-form-group">
                  <label className="auth-form-label" htmlFor="registerConfirmPass">Xác nhận mật khẩu</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="registerConfirmPass"
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      className="auth-input"
                      placeholder="Nhập lại mật khẩu"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="auth-eye-btn"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      aria-label="Toggle confirm password"
                    >
                      {showRegConfirmPassword ? (
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <label className="auth-checkbox-row">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <span className="auth-checkbox-text">
                    Tôi đồng ý với <a href="#terms" onClick={(e) => e.preventDefault()}>Điều khoản dịch vụ</a> và <a href="#privacy" onClick={(e) => e.preventDefault()}>Chính sách bảo mật</a>
                  </span>
                </label>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  <span>{loading ? 'Đang tạo tài khoản...' : 'Đăng ký tài khoản'}</span>
                  {!loading && (
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  )}
                </button>
              </form>
            )}

            <div className="auth-divider">
              <span className="auth-divider-line"></span>
              <span className="auth-divider-text">hoặc tiếp tục với</span>
              <span className="auth-divider-line"></span>
            </div>

            <div className="auth-social-row">
              <button type="button" className="auth-social-btn">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.5 8.9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.5-6.7-5.3L1.6 16c1.9 3.8 5.8 7 10.4 7z" />
                </svg>
                <span>Google</span>
              </button>

              <button type="button" className="auth-social-btn">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* MODAL THÔNG BÁO THÀNH CÔNG */}
      {successModal && (
        <div className="auth-modal-backdrop">
          <div className="auth-modal-card">
            <div className="auth-modal-icon-wrap">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="auth-modal-heading">
              {successModal === 'login' ? 'Đăng nhập thành công' : 'Đăng ký thành công'}
            </h3>
            <p className="auth-modal-text">
              {successModal === 'login'
                ? 'Chào mừng bạn quay lại hệ thống học tập'
                : 'Tài khoản của bạn đã được tạo thành công'}
            </p>
            <button
              className="auth-modal-btn"
              onClick={() => {
                setSuccessModal(false);
                if (successModal === 'login') {
                  navigate('/');
                } else {
                  navigate('/login');
                }
              }}
            >
              {successModal === 'login' ? 'Vào trang chủ' : 'Chuyển sang Đăng nhập'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
