import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#1e293b',
      color: '#ffffff'
    }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
        <Link to="/" style={{ color: '#ffffff' }}>🎓 Đồ Án Tốt Nghiệp</Link>
      </h2>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link to="/" style={{ color: '#cbd5e1' }}>Trang chủ</Link>
        <Link to="/login" style={{ color: '#cbd5e1' }}>Đăng nhập</Link>
      </div>
    </nav>
  );
};

export default Navbar;
