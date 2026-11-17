import React from 'react';
import { Link } from 'react-router-dom';
import './Roadmap.css';

const ROADMAPS = [
  {
    id: 'frontend',
    tag: 'Front-end Developer',
    tagClass: 'frontend',
    title: 'Lộ trình học Front-end',
    desc: 'Lập trình viên Front-end là người xây dựng toàn bộ giao diện website và ứng dụng web trực quan, tương tác trực tiếp với người dùng cuối.',
    steps: [
      { num: 1, title: 'Nền tảng: HTML5, CSS3 & Responsive Design' },
      { num: 2, title: 'Lập trình JavaScript cơ bản đến ES6+ hiện đại' },
      { num: 3, title: 'Xây dựng UI với React.js, Vite & Tailwind CSS' },
      { num: 4, title: 'Quản lý state nâng cao (Redux Toolkit, Zustand) & Tối ưu hiệu năng' },
    ],
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Git/GitHub'],
    coursesCount: 8,
    hoursCount: '120+',
    projectsCount: 4,
  },
  {
    id: 'backend',
    tag: 'Back-end Developer',
    tagClass: 'backend',
    title: 'Lộ trình học Back-end',
    desc: 'Lập trình viên Back-end chịu trách nhiệm xử lý logic nghiệp vụ, thiết kế cơ sở dữ liệu, xây dựng RESTful/GraphQL API và vận hành hệ thống máy chủ.',
    steps: [
      { num: 1, title: 'Kiến thức mạng máy tính, HTTP/HTTPS & Terminal' },
      { num: 2, title: 'Lập trình Node.js, Express.js & Kiến trúc MVC' },
      { num: 3, title: 'Cơ sở dữ liệu quan hệ (PostgreSQL) & NoSQL (MongoDB, Redis)' },
      { num: 4, title: 'Bảo mật API, Authentication (JWT, OAuth) & Microservices' },
    ],
    skills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis', 'RESTful API', 'JWT', 'Docker'],
    coursesCount: 10,
    hoursCount: '150+',
    projectsCount: 5,
  },
  {
    id: 'fullstack',
    tag: 'Fullstack Developer',
    tagClass: 'fullstack',
    title: 'Lộ trình học Fullstack Web',
    desc: 'Làm chủ toàn diện cả giao diện Front-end và hệ thống Back-end. Tự tay thiết kế, xây dựng và đưa sản phẩm thực tế lên môi trường Internet.',
    steps: [
      { num: 1, title: 'Làm chủ Front-end hiện đại với React.js & TypeScript' },
      { num: 2, title: 'Xây dựng Server backend mạnh mẽ với Node.js & Database' },
      { num: 3, title: 'Tích hợp thanh toán, WebSocket thời gian thực & Cloud upload' },
      { num: 4, title: 'Đóng gói Docker, thiết lập CI/CD & Triển khai Production' },
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS', 'Socket.io', 'CI/CD'],
    coursesCount: 14,
    hoursCount: '220+',
    projectsCount: 6,
  },
  {
    id: 'devops',
    tag: 'DevOps & Cloud Engineer',
    tagClass: 'devops',
    title: 'Lộ trình học DevOps',
    desc: 'Tự động hóa quy trình phát hành phần mềm, quản lý hạ tầng đám mây dạng mã (IaC), giám sát hệ thống và đảm bảo độ sẵn sàng cao.',
    steps: [
      { num: 1, title: 'Quản trị hệ điều hành Linux & Bash Scripting chuyên sâu' },
      { num: 2, title: 'Containerization với Docker & Quản lý nhiều container' },
      { num: 3, title: 'Điều phối cụm máy chủ với Kubernetes (K8s)' },
      { num: 4, title: 'Xây dựng pipeline CI/CD tự động & Quản lý đám mây AWS' },
    ],
    skills: ['Linux', 'Docker', 'Kubernetes', 'GitHub Actions', 'AWS/GCP', 'Terraform', 'Prometheus', 'Nginx'],
    coursesCount: 7,
    hoursCount: '110+',
    projectsCount: 4,
  },
];

const RoadmapPage = () => {
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

      {/* Grid danh sách các lộ trình */}
      <div className="roadmap-grid">
        {ROADMAPS.map((item) => (
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
      </div>

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
