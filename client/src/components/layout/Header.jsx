import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [searchValue, setSearchValue] = useState('');
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // Ẩn khi cuộn xuống quá 80px, hiện lại khi cuộn lên
      if (currentY > lastScrollY.current && currentY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${hidden ? 'header--hidden' : ''}`}>
      <div className="header__left">
        <Link to="/" className="header__logo">
          <span className="header__logo-icon">E</span>
          <span className="header__logo-text">HỌC LẬP TRÌNH ĐỂ ĐI LÀM</span>
        </Link>
      </div>

      <div className="header__center">
        <div className="header__search">
          <svg className="header__search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="header__search-input"
            placeholder="Tìm khóa học, bài tập, hỏi đáp..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="header__right">
        <Link to="/register" className="header__btn header__btn--register">Đăng ký</Link>
        <Link to="/login" className="header__btn header__btn--login">Đăng nhập</Link>
      </div>
    </header>
  );
};

export default Header;
