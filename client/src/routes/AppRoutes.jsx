import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      {/* Thêm các Route khác ở đây */}
      <Route path="*" element={<h2>404 - Trang không tồn tại</h2>} />
    </Routes>
  );
};

export default AppRoutes;
