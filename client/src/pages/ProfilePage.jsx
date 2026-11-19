import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './UserPages.css';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [username, setUsername] = useState(user?.username || (user?.email ? `@${user.email.split('@')[0]}` : ''));
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setUsername(user.username || (user.email ? `@${user.email.split('@')[0]}` : ''));
      setPhone(user.phone || '');
      setBio(user.bio || '');
    }
  }, [user]);

  // Lấy số lượng khóa học thật từ API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/enrollments');
        if (res.data) {
          setEnrolledCount(res.data.length);
          const done = res.data.filter(e => e.status === 'completed' || Number(e.progress) >= 100).length;
          setCompletedCount(done);
        }
      } catch (err) {
        // im lặng nếu chưa đăng nhập
      }
    };

    fetchStats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      // Gọi API cập nhật vào MySQL
      const res = await api.put('/auth/profile', {
        name: name.trim(),
        avatar: user?.avatar || null,
      });

      if (res.data) {
        updateUser(res.data);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Không thể cập nhật thông tin cá nhân');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-page">
      <div className="user-page__container">
        <div className="user-page__header">
          <h1 className="user-page__title">Trang cá nhân</h1>
          <p className="user-page__subtitle">Quản lý và cập nhật thông tin cá nhân của bạn</p>
        </div>

        {savedSuccess && (
          <div className="user-alert user-alert--success">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Cập nhật thông tin thành công</span>
          </div>
        )}

        {errorMessage && (
          <div className="user-alert" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="user-profile-layout">
          {/* Cột trái: Avatar & tóm tắt */}
          <div className="user-profile-sidebar">
            <div className="user-profile-avatar-wrap">
              <div className="user-profile-avatar-big">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <svg viewBox="0 0 24 24" width="56" height="56" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
              <h3 className="user-profile-name">{name || 'Học viên'}</h3>
              <p className="user-profile-handle">{username}</p>
            </div>

            <div className="user-profile-stats">
              <div className="user-stat-card">
                <span className="user-stat-num">{enrolledCount}</span>
                <span className="user-stat-label">Khóa học sở hữu</span>
              </div>
              <div className="user-stat-card">
                <span className="user-stat-num">{completedCount}</span>
                <span className="user-stat-label">Hoàn thành</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Form chỉnh sửa thông tin */}
          <div className="user-profile-form-wrap">
            <form onSubmit={handleSubmit}>
              <div className="user-form-row">
                <div className="user-form-group">
                  <label className="user-form-label">Họ và tên</label>
                  <input
                    type="text"
                    className="user-form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="user-form-group">
                  <label className="user-form-label">Tên định danh</label>
                  <input
                    type="text"
                    className="user-form-input"
                    value={username}
                    readOnly
                    disabled
                    style={{ backgroundColor: '#f8fafc', color: '#94a3b8' }}
                  />
                </div>
              </div>

              <div className="user-form-row">
                <div className="user-form-group">
                  <label className="user-form-label">Địa chỉ Email</label>
                  <input
                    type="email"
                    className="user-form-input"
                    value={email}
                    readOnly
                    disabled
                    style={{ backgroundColor: '#f8fafc', color: '#94a3b8' }}
                  />
                </div>
              </div>

              <div className="user-form-actions">
                <button
                  type="submit"
                  className="user-btn-save"
                  disabled={loading}
                >
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
