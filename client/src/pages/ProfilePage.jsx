import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './UserPages.css';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || 'Anh Tú');
  const [email, setEmail] = useState(user?.email || 'anhtu@example.com');
  const [username, setUsername] = useState(user?.username || '@tuanhifmzc');
  const [phone, setPhone] = useState(user?.phone || '0987654321');
  const [bio, setBio] = useState(user?.bio || 'Học viên đam mê lập trình Fullstack Web');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({
      name: name.trim(),
      email: email.trim(),
      username: username.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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
              <h3 className="user-profile-name">{name}</h3>
              <p className="user-profile-handle">{username}</p>
            </div>

            <div className="user-profile-stats">
              <div className="user-stat-card">
                <span className="user-stat-num">2</span>
                <span className="user-stat-label">Khóa học sở hữu</span>
              </div>
              <div className="user-stat-card">
                <span className="user-stat-num">1</span>
                <span className="user-stat-label">Chứng nhận</span>
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
                  <label className="user-form-label">Tên người dùng (Username)</label>
                  <input
                    type="text"
                    className="user-form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
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
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="user-form-group">
                  <label className="user-form-label">Số điện thoại</label>
                  <input
                    type="tel"
                    className="user-form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="user-form-group">
                <label className="user-form-label">Giới thiệu bản thân (Bio)</label>
                <textarea
                  className="user-form-textarea"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Chia sẻ một chút về mục tiêu học tập và kỹ năng của bạn..."
                />
              </div>

              <div className="user-form-actions">
                <button type="submit" className="user-btn-save">
                  Lưu thay đổi
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
