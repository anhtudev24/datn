import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';

/* Placeholder pages — bạn sẽ phát triển thêm sau */
const RoadmapPage = () => (
  <div>
    <h1>Lộ trình học</h1>
    <p style={{ color: '#666', marginTop: 8 }}>Lộ trình học tập từ cơ bản đến nâng cao sẽ được cập nhật tại đây.</p>
  </div>
);

const NewsfeedPage = () => (
  <div>
    <h1>Bảng tin</h1>
    <p style={{ color: '#666', marginTop: 8 }}>Các bài viết, thảo luận từ cộng đồng sẽ xuất hiện tại đây.</p>
  </div>
);

const MyCoursesPage = () => (
  <div>
    <h1>Khóa học của tôi</h1>
    <p style={{ color: '#666', marginTop: 8 }}>Bạn cần đăng nhập để xem danh sách khóa học đã đăng ký.</p>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lo-trinh" element={<RoadmapPage />} />
      <Route path="/bang-tin" element={<NewsfeedPage />} />
      <Route path="/khoa-hoc-cua-toi" element={<MyCoursesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<LoginPage />} />
      <Route path="*" element={<h2>404 — Trang không tồn tại</h2>} />
    </Routes>
  );
};

export default AppRoutes;
