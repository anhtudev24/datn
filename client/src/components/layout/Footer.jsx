import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '1.5rem',
      backgroundColor: '#f1f5f9',
      borderTop: '1px solid #e2e8f0',
      color: '#64748b',
      fontSize: '0.875rem'
    }}>
      <p>© {new Date().getFullYear()} Đồ Án Tốt Nghiệp. Xây dựng bằng React & Node.js.</p>
    </footer>
  );
};

export default Footer;
