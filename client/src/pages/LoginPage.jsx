import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [successOverlay, setSuccessOverlay] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
      }
      setSuccessOverlay(true);
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Email hoặc mật khẩu không chính xác, vui lòng thử lại!',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Nút quay lại trang chủ */}
      <Link to="/" className="auth-back-btn">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Trang chủ</span>
      </Link>

      <div className="auth-container">
        {/* CỘT TRÁI: GIỚI THIỆU & THƯƠNG HIỆU */}
        <div className="auth-showcase">
          <div className="auth-showcase__header">
            <div className="auth-logo-badge">E</div>
            <span className="auth-logo-text">HỌC LẬP TRÌNH ĐỂ ĐI LÀM</span>
          </div>

          <div className="auth-showcase__body">
            <h1 className="auth-showcase__title">
              Nâng cao kỹ năng lập trình <span>thực chiến</span> cùng chuyên gia
            </h1>
            <p className="auth-showcase__desc">
              Hệ thống học tập định hướng chuyên nghiệp, review code trực tiếp và đồng hành cùng bạn từ nền tảng đến dự án quy mô doanh nghiệp.
            </p>

            <div className="auth-features-list">
              <div className="auth-feature-card">
                <div className="auth-feature-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <div className="auth-feature-text">
                  <h4>Review code 1 kèm 1</h4>
                  <p>Nhận phản hồi chi tiết về kiến trúc mã nguồn và tối ưu hiệu năng.</p>
                </div>
              </div>

              <div className="auth-feature-card">
                <div className="auth-feature-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <div className="auth-feature-text">
                  <h4>Dự án chuẩn doanh nghiệp</h4>
                  <p>Thực hành xây dựng các ứng dụng Fullstack hoàn chỉnh, có thể đưa vào CV.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-showcase__footer">
            <div className="auth-showcase__stat">
              <strong>185.000+</strong>
              <span>học viên tin tưởng</span>
            </div>
            <span>•</span>
            <div className="auth-showcase__stat">
              <strong>98%</strong>
              <span>hài lòng về lộ trình</span>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: FORM ĐĂNG NHẬP */}
        <div className="auth-form-panel">
          <div className="auth-card">
            <div className="auth-card__header">
              <h2 className="auth-card__title">Đăng nhập</h2>
              <p className="auth-card__subtitle">Chào mừng bạn quay trở lại với hệ thống học tập</p>
            </div>

            {/* Chuyển đổi Đăng nhập / Đăng ký */}
            <div className="auth-switcher">
              <button type="button" className="auth-switcher-btn active">
                Đăng nhập
              </button>
              <Link to="/register" className="auth-switcher-btn">
                Đăng ký
              </Link>
            </div>

            {/* Thông báo lỗi */}
            {alert && (
              <div className={`auth-alert auth-alert--${alert.type}`}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{alert.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="form-group">
                <label className="form-label" htmlFor="loginEmail">Email hoặc tài khoản</label>
                <div className="input-container">
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <input
                    id="loginEmail"
                    type="email"
                    className="input-field"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label" htmlFor="loginPass">Mật khẩu</label>
                  <a href="#forgot" className="form-forgot-link" onClick={(e) => e.preventDefault()}>
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="input-container">
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <input
                    id="loginPass"
                    type={showPassword ? 'text' : 'password'}
                    className="input-field"
                    placeholder="Nhập mật khẩu của bạn"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password"
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <label className="form-checkbox-row">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkbox-label">Ghi nhớ trạng thái đăng nhập trên thiết bị này</span>
              </label>

              <button type="submit" className="btn-auth-submit" disabled={loading}>
                <span>{loading ? 'Đang xác thực...' : 'Đăng nhập vào tài khoản'}</span>
                {!loading && (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                )}
              </button>

              <div className="auth-separator">
                <span className="auth-separator-line"></span>
                <span className="auth-separator-text">hoặc tiếp tục với</span>
                <span className="auth-separator-line"></span>
              </div>

              <div className="auth-social-grid">
                <button type="button" className="btn-social">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.5 8.9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                    <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.5-6.7-5.3L1.6 16c1.9 3.8 5.8 7 10.4 7z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button type="button" className="btn-social">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* MODAL THÀNH CÔNG */}
      {successOverlay && (
        <div className="auth-modal-overlay">
          <div className="auth-modal-box">
            <div className="auth-modal-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="auth-modal-title">Đăng nhập thành công</h3>
            <p className="auth-modal-desc">Chào mừng bạn quay trở lại! Bạn có thể tiếp tục học tập ngay bây giờ.</p>
            <button className="btn-modal-action" onClick={() => navigate('/')}>
              Về Trang Chủ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
