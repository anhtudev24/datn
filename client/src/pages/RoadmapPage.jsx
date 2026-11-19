import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Roadmap.css';

const RoadmapPage = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      setLoading(true);
      try {
        const res = await api.get('/roadmaps');
        if (res.data) {
          const mapped = res.data.map((r) => ({
            id: r.slug,
            tag: r.tag_badge,
            tagClass: r.slug.replace('lo-trinh-', ''),
            title: r.title,
            desc: r.description,
            steps: Array.isArray(r.steps) ? r.steps : [],
            skills: Array.isArray(r.skills) ? r.skills : [],
            coursesCount: r.courses_count || 8,
            hoursCount: r.hours_count || '100+',
            projectsCount: r.projects_count || 4,
          }));
          setRoadmaps(mapped);
        }
      } catch (err) {
        console.error('Lỗi khi tải lộ trình học từ server:', err);
        setError(err.message || 'Không thể kết nối máy chủ');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  return (
    <div className="roadmap-page">
      {/* Header giới thiệu */}
      <div className="roadmap-header">
        <div className="roadmap-header__badge">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span>Lộ trình nghề nghiệp bài bản</span>
        </div>
        <h1 className="roadmap-header__title">Lộ trình học lập trình</h1>
        <p className="roadmap-header__desc">
          Để bắt đầu một cách thuận lợi và đạt kết quả cao nhất, bạn nên chọn một lộ trình phù hợp với mục tiêu của mình. 
          Mỗi lộ trình được sắp xếp khoa học từ cơ bản đến dự án chuẩn doanh nghiệp có thể đưa trực tiếp vào CV.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}>
          Đang tải danh sách lộ trình từ hệ thống...
        </div>
      ) : (
        /* Grid danh sách các lộ trình */
        <div className="roadmap-grid">
          {roadmaps.map((item) => (
            <div key={item.id} className="roadmap-card">
              <div className="roadmap-card__top">
                <span className={`roadmap-card__tag roadmap-card__tag--${item.tagClass}`}>
                  {item.tag}
                </span>
                <h2 className="roadmap-card__title">{item.title}</h2>
                <p className="roadmap-card__desc">{item.desc}</p>

                {/* Các mốc chặng */}
                <div className="roadmap-steps">
                  {item.steps.map((st) => (
                    <div key={st.num} className="roadmap-step">
                      <span className="roadmap-step__num">{st.num}</span>
                      <span className="roadmap-step__title">{st.title}</span>
                    </div>
                  ))}
                </div>

                {/* Kỹ năng tích lũy */}
                <div className="roadmap-skills">
                  {item.skills.map((skill) => (
                    <span key={skill} className="roadmap-skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chân card: Thông số và CTA */}
              <div className="roadmap-card__bottom">
                <div className="roadmap-stats">
                  <span><strong>{item.coursesCount}</strong> khóa học</span>
                  <span>•</span>
                  <span><strong>{item.hoursCount}</strong> giờ</span>
                  <span>•</span>
                  <span><strong>{item.projectsCount}</strong> dự án</span>
                </div>
                <Link to="/" className="roadmap-btn-view">
                  <span>Xem chi tiết</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}

          {roadmaps.length === 0 && (
            <p style={{ textAlign: 'center', color: '#64748b', gridColumn: '1 / -1', padding: '32px 0' }}>
              Chưa có lộ trình nào được khởi tạo.
            </p>
          )}
        </div>
      )}

      {/* Banner tư vấn lộ trình */}
      <div className="roadmap-consult-banner">
        <div className="roadmap-consult-text">
          <h3>Bạn chưa xác định được lộ trình phù hợp?</h3>
          <p>Đội ngũ chuyên gia và mentor sẽ tư vấn định hướng 1-1 miễn phí dựa trên năng lực và mục tiêu nghề nghiệp của bạn.</p>
        </div>
        <Link to="/register" className="roadmap-consult-btn">
          Nhận tư vấn miễn phí
        </Link>
      </div>
    </div>
  );
};

export default RoadmapPage;
