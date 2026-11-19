import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  //// 1. Khởi tạo state user (lấy từ localStorage nếu trước đó đã đăng nhập)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Khi tải ứng dụng, nếu có token thì gọi API /auth/me để lấy dữ liệu người dùng thật từ Server
  useEffect(() => {
    const verifyUser = async () => {
      const savedToken = localStorage.getItem('token');
      if (!savedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data) {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      } catch (err) {
        console.warn('Phiên đăng nhập không hợp lệ hoặc đã hết hạn, đăng xuất:', err);
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [token]);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedData };
      localStorage.setItem('user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const isAuthenticated = Boolean(token && user);

  //// 1. Khởi tạo state user (lấy từ localStorage nếu trước đó đã đăng nhập)
  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Tạo custom hook 
export const useAuth = () => {
  const context = useContext(AuthContext); //lấy toàn bộ {user, token, isAuth}
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
