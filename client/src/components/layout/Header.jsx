import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth(); // hứng dữu liệu bên authContext

  
  const [searchValue, setSearchValue] = useState('');
  const [hidden, setHidden] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const lastScrollY = useRef(0);
  const notifyRef = useRef(null);
  const userMenuRef = useRef(null);

  // Fetch thông báo từ API khi đăng nhập
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchNotifs = async () => {
      try {
        const res = await api.get('/notifications?type=notification');
        if (res.data) {
          setNotifications(res.data);
        }
      } catch (err) {
        // im lặng nếu chưa có mạng
      }
    };

    fetchNotifs();
  }, [isAuthenticated]);

  // Xử lý ẩn/hiện header khi cuộn
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 80) {
        setHidden(true);
        setShowNotify(false);
        setShowUserMenu(false);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifyRef.current && !notifyRef.current.contains(e.target)) {
        setShowNotify(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowNotify(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className={`header ${hidden ? 'header--hidden' : ''}`}>
      {/* CỘT TRÁI: LOGO */}
      <div className="header__left">
        <Link to="/" className="header__logo">
          <span className="header__logo-icon">ES</span>
          <span className="header__logo-text">Biến đam mê thành sự nghiệp</span>
        </Link>
      </div>

      {/* CỘT GIỮA: TÌM KIẾM */}
      <div className="header__center">
        <div className="header__search">
          <svg className="header__search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="header__search-input"
            placeholder="Tìm kiếm khóa học, bài viết, video..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      {/* CỘT PHẢI: CHƯA ĐĂNG NHẬP HOẶC ĐÃ ĐĂNG NHẬP */}
      <div className="header__right">
        {!isAuthenticated ? (
          /* TRẠNG THÁI: CHƯA ĐĂNG NHẬP */
          <div className="header__auth-guest">
            <Link to="/register" className="header__btn header__btn--register">Đăng ký</Link>
            <Link to="/login" className="header__btn header__btn--login">Đăng nhập</Link>
          </div>
        ) : (
          /* TRẠNG THÁI: ĐÃ ĐĂNG NHẬP */
          <div className="header__auth-logged">
            {/* Icon Chuông thông báo */}
            <div className="header__notify-wrap" ref={notifyRef}>
              <button
                type="button"
                className={`header__icon-btn ${showNotify ? 'active' : ''}`}
                onClick={() => {
                  setShowNotify(!showNotify);
                  setShowUserMenu(false);
                }}
                aria-label="Thông báo"
                title="Thông báo"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
                </svg>
              </button>

              {/* POPUP THÔNG BÁO */}
              {showNotify && (
                <div className="header-dropdown header-dropdown--notify">
                  <div className="header-dropdown__header">
                    <h3>Thông báo</h3>
                  </div>
                  {notifications.length > 0 ? (
                    <div className="header-dropdown__notif-list">
                      {notifications.map((n) => (
                        <div key={n.id} className="header-dropdown__notif-item">
                          <p className="notif-title">{n.title}</p>
                          {n.content && <p className="notif-content">{n.content}</p>}
                          <span className="notif-time">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="header-dropdown__body header-dropdown__body--empty">
                      <p>Chưa có thông báo nào</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Icon Avatar người dùng */}
            <div className="header__avatar-wrap" ref={userMenuRef}>
              <button
                type="button"
                className={`header__avatar-btn ${showUserMenu ? 'active' : ''}`}
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotify(false);
                }}
                aria-label="Menu cá nhân"
                title={user?.name || 'Tài khoản'}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="header__avatar-img" />
                ) : (
                  <div className="header__avatar-placeholder">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </button>

              {/* DROPDOWN MENU AVATAR */}
              {showUserMenu && (
                <div className="header-dropdown header-dropdown--user">
                  {/* User Profile Header */}
                  <div className="header-user-card">
                    <div className="header-user-avatar">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        <div className="header-user-avatar__placeholder">
                          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="header-user-meta">
                      <h4 className="header-user-name">{user?.name || 'Học viên'}</h4>
                      <span className="header-user-handle">{user?.username || (user?.email ? `@${user.email.split('@')[0]}` : '')}</span>
                    </div>
                  </div>

                  <div className="header-dropdown__divider"></div>

                  {/* Menu Links */}
                  <ul className="header-dropdown__list">
                    <li>
                      <Link
                        to="/profile"
                        className="header-dropdown__item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Trang cá nhân
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/my-orders"
                        className="header-dropdown__item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Đơn hàng của tôi
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/payment-history"
                        className="header-dropdown__item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Lịch sử thanh toán
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/activities"
                        className="header-dropdown__item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Hoạt động
                      </Link>
                    </li>
                  </ul>

                  <div className="header-dropdown__divider"></div>

                  <ul className="header-dropdown__list">
                    <li>
                      <Link
                        to="/change-password"
                        className="header-dropdown__item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Đổi mật khẩu
                      </Link>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="header-dropdown__item header-dropdown__item--danger"
                        onClick={handleLogout}
                      >
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
