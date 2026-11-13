import React, { useState, useEffect } from 'react';
import api from '../services/api';

const HomePage = () => {
  const [serverStatus, setServerStatus] = useState('Đang kiểm tra kết nối tới Backend...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Thử kết nối tới Backend API endpoint /health
    api.get('/health')
      .then((data) => {
        setServerStatus(`🟢 ${data.message} (${data.timestamp})`);
      })
      .catch((err) => {
        setServerStatus('🔴 Chưa kết nối được tới Backend (Server chưa chạy hoặc lỗi CORS)');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Trang Chủ Đồ Án</h1>
      <p style={{ marginTop: '0.5rem', color: '#64748b' }}>
        Chào mừng bạn đến với hệ thống mẫu đồ án tốt nghiệp React (Frontend) & Node.js (Backend).
      </p>

      <div className="card">
        <h3>Trạng thái kết nối Backend:</h3>
        <p style={{ marginTop: '0.5rem', fontWeight: 500 }}>{serverStatus}</p>
      </div>

      <div className="card">
        <h3>Cấu trúc dự án:</h3>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li><strong>client/</strong>: Chứa mã nguồn React, Vite, React Router, Axios.</li>
          <li><strong>server/</strong>: Chứa mã nguồn Node.js, Express theo mô hình MVC / Controller-Service.</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
