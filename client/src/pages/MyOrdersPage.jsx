import React from 'react';
import { Link } from 'react-router-dom';
import './UserPages.css';

const MOCK_ORDERS = [
  {
    id: 'DH-84920',
    courseName: 'Khóa học Fullstack Web Developer Chuyên Nghiệp',
    date: '15/11/2026',
    price: '1.299.000 đ',
    originalPrice: '2.500.000 đ',
    status: 'Đã kích hoạt',
    paymentMethod: 'VNPay QR',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
  },
  {
    id: 'DH-81203',
    courseName: 'Lập trình Javascript Nâng Cao (ES6+ & Async)',
    date: '02/10/2026',
    price: '699.000 đ',
    originalPrice: '1.200.000 đ',
    status: 'Đã kích hoạt',
    paymentMethod: 'Chuyển khoản ngân hàng',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&q=80',
  },
];

const MyOrdersPage = () => {
  return (
    <div className="user-page">
      <div className="user-page__container">
        <div className="user-page__header">
          <h1 className="user-page__title">Đơn hàng của tôi</h1>
          <p className="user-page__subtitle">Danh sách các khóa học và chương trình đào tạo bạn đã đăng ký</p>
        </div>

        <div className="orders-list">
          {MOCK_ORDERS.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card__header">
                <div className="order-card__meta">
                  <span className="order-id">Mã đơn: <strong>{order.id}</strong></span>
                  <span className="order-date">Ngày đặt: {order.date}</span>
                </div>
                <span className="order-status order-status--active">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {order.status}
                </span>
              </div>

              <div className="order-card__body">
                <img src={order.thumbnail} alt={order.courseName} className="order-thumb" />
                <div className="order-info">
                  <h3 className="order-course-title">{order.courseName}</h3>
                  <p className="order-payment-method">Phương thức: {order.paymentMethod}</p>
                  <div className="order-price-wrap">
                    <span className="order-price">{order.price}</span>
                    <span className="order-price-original">{order.originalPrice}</span>
                  </div>
                </div>
                <div className="order-action">
                  <Link to="/khoa-hoc-cua-toi" className="order-btn-study">
                    Vào học ngay
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
