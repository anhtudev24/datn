import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  const location = useLocation();
  const isAuthRoute = ['/login', '/register'].includes(location.pathname);
  const isLearningRoute = location.pathname.startsWith('/learning/') || location.pathname.startsWith('/hoc-tap/');

  // Nếu là trang Auth (Login / Register), render độc lập không kèm Header và Sidebar
  if (isAuthRoute) {
    return (
      <main className="auth-standalone-layout">
        <AppRoutes />
      </main>
    );
  }

  // Nếu là trang học (Learning), ẩn Sidebar chung để không gian 3 cột học tập rộng rãi toàn màn hình
  if (isLearningRoute) {
    return (
      <div className="app app--learning-mode" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
        <Header />
        <main className="app__content" style={{ marginLeft: 0, padding: 0, width: '100%' }}>
          <AppRoutes />
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <Sidebar />
      <main className="app__content">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
