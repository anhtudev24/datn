import React, { useState } from 'react';
import './UserPages.css';

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert(null);

    if (newPassword.length < 6) {
      setAlert({
        type: 'error',
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự',
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setAlert({
        type: 'error',
        message: 'Mật khẩu mới xác nhận không khớp, vui lòng kiểm tra lại',
      });
      return;
    }

    setLoading(true);

    // Giả lập cập nhật mật khẩu thành công
    setTimeout(() => {
      setLoading(false);
      setAlert({
        type: 'success',
        message: 'Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới của bạn.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }, 600);
  };

  return (
    <div className="user-page">
      <div className="user-page__container" style={{ maxWidth: '640px' }}>
        <div className="user-page__header">
          <h1 className="user-page__title">Đổi mật khẩu</h1>
          <p className="user-page__subtitle">Cập nhật mật khẩu định kỳ để nâng cao tính bảo mật cho tài khoản của bạn</p>
        </div>

        {alert && (
          <div className={`user-alert user-alert--${alert.type}`}>
            {alert.type === 'success' ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            <span>{alert.message}</span>
          </div>
        )}

        <div className="user-profile-form-wrap">
          <form onSubmit={handleSubmit}>
            <div className="user-form-group">
              <label className="user-form-label">Mật khẩu hiện tại</label>
              <div className="user-input-password-wrap">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  className="user-form-input"
                  placeholder="Nhập mật khẩu đang sử dụng"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="user-btn-eye"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>

            <div className="user-form-group">
              <label className="user-form-label">Mật khẩu mới</label>
              <div className="user-input-password-wrap">
                <input
                  type={showNew ? 'text' : 'password'}
                  className="user-form-input"
                  placeholder="Tối thiểu 6 ký tự"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="user-btn-eye"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>

            <div className="user-form-group">
              <label className="user-form-label">Xác nhận mật khẩu mới</label>
              <div className="user-input-password-wrap">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="user-form-input"
                  placeholder="Nhập lại mật khẩu mới vừa nhập"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="user-btn-eye"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>

            <div className="user-form-actions">
              <button type="submit" className="user-btn-save" disabled={loading}>
                {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
