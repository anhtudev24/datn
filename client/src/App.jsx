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

  // Nếu là trang Auth (Login / Register), render độc lập không kèm Header và Sidebar
  if (isAuthRoute) {
    return (
      <main className="auth-standalone-layout">
        <AppRoutes />
      </main>
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
