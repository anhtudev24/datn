import React from 'react';
import './UserPages.css';

const MOCK_ACTIVITIES = [
  {
    id: 1,
    title: 'Hoàn thành bài tập: React Custom Hooks & Context API',
    course: 'Fullstack Web Developer',
    time: '2 giờ trước',
    type: 'exercise',
  },
  {
    id: 2,
    title: 'Đăng ký thành công khóa học Lập trình Javascript Nâng Cao',
    course: 'Javascript Advanced',
    time: '3 ngày trước',
    type: 'enroll',
  },
  {
    id: 3,
    title: 'Đã hoàn thành chương: Cấu trúc dữ liệu & Thuật toán cơ bản',
    course: 'Khoa học máy tính',
    time: '1 tuần trước',
    type: 'chapter',
  },
  {
    id: 4,
    title: 'Đặt câu hỏi trong cộng đồng: Cách tối ưu re-render trong React 18',
    course: 'Diễn đàn hỏi đáp',
    time: '2 tuần trước',
    type: 'comment',
  },
];

const ActivitiesPage = () => {
  return (
    <div className="user-page">
      <div className="user-page__container" style={{ maxWidth: '780px' }}>
        <div className="user-page__header">
          <h1 className="user-page__title">Hoạt động</h1>
          <p className="user-page__subtitle">Nhật ký tiến trình học tập, hoàn thành bài tập và tương tác của bạn</p>
        </div>

        <div className="activity-timeline">
          {MOCK_ACTIVITIES.map((act) => (
            <div key={act.id} className="activity-item">
              <div className="activity-item__dot"></div>
              <div className="activity-item__content">
                <div className="activity-item__header">
                  <h3 className="activity-item__title">{act.title}</h3>
                  <span className="activity-item__time">{act.time}</span>
                </div>
                <span className="activity-item__badge">{act.course}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;
