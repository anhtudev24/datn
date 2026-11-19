import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './UserPages.css';

const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/notifications?type=activity');
        setActivities(res.data || []);
      } catch (err) {
        console.error('Lỗi tải nhật ký hoạt động:', err);
        setError('Không thể tải dữ liệu hoạt động. Vui lòng thử lại.');
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="user-page">
      <div className="user-page__container" style={{ maxWidth: '780px' }}>
        <div className="user-page__header">
          <h1 className="user-page__title">Hoạt động</h1>
          <p className="user-page__subtitle">Nhật ký tiến trình học tập, hoàn thành bài tập và tương tác của bạn</p>
        </div>

        {loading && (
          <div className="user-page-state">Đang tải nhật ký hoạt động từ hệ thống...</div>
        )}
        {!loading && error && (
          <div className="user-page-state user-page-state--error">{error}</div>
        )}
        {!loading && !error && activities.length === 0 && (
          <div className="user-page-empty">
            <div className="user-page-empty__icon">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <h3>Chưa có hoạt động nào</h3>
            <p>Bắt đầu học một khóa học để nhật ký hoạt động của bạn được ghi lại tại đây.</p>
          </div>
        )}

        {!loading && !error && activities.length > 0 && (
          <div className="activity-timeline">
            {activities.map((act) => (
              <div key={act.id} className="activity-item">
                <div className="activity-item__dot"></div>
                <div className="activity-item__content">
                  <div className="activity-item__header">
                    <h3 className="activity-item__title">{act.title}</h3>
                    <span className="activity-item__time">{act.time}</span>
                  </div>
                  {act.content && (
                    <p className="activity-item__desc">{act.content}</p>
                  )}
                  {act.course && (
                    <span className="activity-item__badge">{act.course}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitiesPage;
