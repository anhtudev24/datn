import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  useEffect(() => {
    // Nếu có token nhưng chưa có user (ví dụ vừa login với token mẫu), tạo user mặc định
    if (token && !user) {
      const defaultUser = {
        id: 1,
        name: 'Anh Tú',
        email: 'anhtu@example.com',
        username: '@tuanhifmzc',
        phone: '0987654321',
        bio: 'Học viên đam mê lập trình Fullstack Web',
        avatar: null,
      };
      setUser(defaultUser);
      localStorage.setItem('user', JSON.stringify(defaultUser));
    }
  }, [token, user]);

  const login = (newToken, newUser) => {
    const finalUser = newUser || {
      id: 1,
      name: 'Anh Tú',
      email: 'anhtu@example.com',
      username: '@tuanhifmzc',
      phone: '0987654321',
      bio: 'Học viên đam mê lập trình Fullstack Web',
      avatar: null,
    };
    setToken(newToken);
    setUser(finalUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(finalUser));
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

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
