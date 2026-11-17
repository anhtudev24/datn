import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* ===== FOOTER MAIN ===== */}
      <div className="footer__main">
        {/* Cột Logo */}
        <div className="footer__col footer__col--brand">
          <Link to="/" className="footer__logo">
            <span className="footer__logo-icon">E</span>
          </Link>
          <p className="footer__brand-text">Biến đam mê thành sự nghiệp</p>
        </div>

        {/* Cột Liên hệ */}
        <div className="footer__col">
          <div className="footer__contact-item">
            <span className="footer__contact-label">HOTLINE</span>
            <span className="footer__contact-value">08 1919 8989</span>
          </div>
          <div className="footer__contact-item">
            <span className="footer__contact-label">EMAIL</span>
            <span className="footer__contact-value">contact@edu.vn</span>
          </div>
          <div className="footer__contact-item">
            <span className="footer__contact-label">ĐỊA CHỈ</span>
            <span className="footer__contact-value">
              Số 1, ngõ 41, Trần Duy Hưng,<br />
              Cầu Giấy, Hà Nội
            </span>
          </div>
          <div className="footer__contact-item">
            <span className="footer__contact-label">KÊNH CHÍNH THỨC</span>
            <div className="footer__socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">TikTok</a>
            </div>
          </div>
        </div>

        {/* Cột Về chúng tôi */}
        <div className="footer__col">
          <h4 className="footer__col-title">VỀ CHÚNG TÔI</h4>
          <ul className="footer__links">
            <li><Link to="/gioi-thieu">Giới thiệu</Link></li>
            <li><Link to="/lien-he">Liên hệ</Link></li>
            <li><Link to="/dieu-khoan">Điều khoản & Quy định</Link></li>
            <li><Link to="/bao-mat">Chính sách bảo mật</Link></li>
          </ul>
        </div>

        {/* Cột Hỗ trợ */}
        <div className="footer__col">
          <h4 className="footer__col-title">HỖ TRỢ</h4>
          <ul className="footer__links">
            <li><Link to="/chinh-sach-thanh-toan">Chính sách thanh toán</Link></li>
            <li><Link to="/chinh-sach-van-chuyen">Chính sách vận chuyển</Link></li>
            <li><Link to="/chinh-sach-kiem-hang">Chính sách kiểm hàng</Link></li>
            <li><Link to="/quy-dinh-ve-gia">Quy định về giá</Link></li>
          </ul>
        </div>

        {/* Cột Công cụ */}
        <div className="footer__col">
          <h4 className="footer__col-title">CÔNG CỤ</h4>
          <ul className="footer__links">
            <li><Link to="/tao-cv">Tạo CV xin việc</Link></li>
            <li><Link to="/rut-gon-lien-ket">Rút gọn liên kết</Link></li>
            <li><Link to="/clip-path-maker">Clip-path maker</Link></li>
            <li><Link to="/snippet-generator">Snippet generator</Link></li>
            <li><Link to="/css-grid-generator">CSS Grid generator</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
