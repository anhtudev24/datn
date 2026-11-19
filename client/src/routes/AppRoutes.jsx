import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RoadmapPage from '../pages/RoadmapPage';
import NewsfeedPage from '../pages/NewsfeedPage';
import MyCoursesPage from '../pages/MyCoursesPage';
import ProfilePage from '../pages/ProfilePage';
import MyOrdersPage from '../pages/MyOrdersPage';
import PaymentHistoryPage from '../pages/PaymentHistoryPage';
import ActivitiesPage from '../pages/ActivitiesPage';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import CourseDetailPage from '../pages/CourseDetailPage';
import LearningPage from '../pages/LearningPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lo-trinh" element={<RoadmapPage />} />
      <Route path="/bang-tin" element={<NewsfeedPage />} />
      <Route path="/khoa-hoc-cua-toi" element={<MyCoursesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<LoginPage />} />
      
      {/* Landing page chi tiết khóa học */}
      <Route path="/courses/:slug" element={<CourseDetailPage />} />
      <Route path="/khoa-hoc/:slug" element={<CourseDetailPage />} />

      {/* Không gian học tập (Video player + Curriculum) */}
      <Route path="/learning/:slug" element={<LearningPage />} />
      <Route path="/hoc-tap/:slug" element={<LearningPage />} />

      {/* Các chức năng cá nhân */}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/my-orders" element={<MyOrdersPage />} />
      <Route path="/payment-history" element={<PaymentHistoryPage />} />
      <Route path="/activities" element={<ActivitiesPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      <Route path="/settings" element={<ProfilePage />} />

      <Route path="*" element={<h2 style={{ padding: 32 }}>404 — Trang không tồn tại</h2>} />
    </Routes>
  );
};

export default AppRoutes;
