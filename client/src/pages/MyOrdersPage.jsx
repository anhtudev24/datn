import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './UserPages.css';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/orders');
        setOrders(res.data || []);
      } catch (err) {
        console.error('Lỗi tải đơn hàng:', err);
        setError('Không thể tải đơn hàng. Vui lòng thử lại.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="user-page">
      <div className="user-page__container">
        <div className="user-page__header">
          <h1 className="user-page__title">Đơn hàng của tôi</h1>
          <p className="user-page__subtitle">Danh sách các khóa học và chương trình đào tạo bạn đã đăng ký</p>
        </div>

        {loading && (
          <div className="user-page-state">Đang tải dữ liệu từ hệ thống...</div>
        )}
        {!loading && error && (
          <div className="user-page-state user-page-state--error">{error}</div>
        )}
        {!loading && !error && orders.length === 0 && (
          <div className="user-page-empty">
            <div className="user-page-empty__icon">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <h3>Chưa có đơn hàng nào</h3>
            <p>Hãy khám phá danh sách khóa học và đăng ký khóa học phù hợp với bạn.</p>
            <Link to="/lo-trinh" className="user-page-empty__btn">Khám phá khóa học</Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
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
                  {order.thumbnail && (
                    <img src={order.thumbnail} alt={order.courseName} className="order-thumb" />
                  )}
                  <div className="order-info">
                    <h3 className="order-course-title">{order.courseName}</h3>
                    <p className="order-payment-method">Phương thức: {order.paymentMethod}</p>
                    <div className="order-price-wrap">
                      <span className="order-price">{order.price}</span>
                      {order.originalPrice && (
                        <span className="order-price-original">{order.originalPrice}</span>
                      )}
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
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
