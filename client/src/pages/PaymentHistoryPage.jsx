import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './UserPages.css';

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/orders/payments');
        setPayments(res.data || []);
      } catch (err) {
        console.error('Lỗi tải lịch sử thanh toán:', err);
        setError('Không thể tải lịch sử thanh toán. Vui lòng thử lại.');
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="user-page">
      <div className="user-page__container">
        <div className="user-page__header">
          <h1 className="user-page__title">Lịch sử thanh toán</h1>
          <p className="user-page__subtitle">Theo dõi các giao dịch thanh toán và hóa đơn điện tử của bạn</p>
        </div>

        {loading && (
          <div className="user-page-state">Đang tải dữ liệu từ hệ thống...</div>
        )}
        {!loading && error && (
          <div className="user-page-state user-page-state--error">{error}</div>
        )}
        {!loading && !error && payments.length === 0 && (
          <div className="user-page-empty">
            <div className="user-page-empty__icon">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <h3>Chưa có giao dịch nào</h3>
            <p>Các giao dịch thanh toán sẽ xuất hiện tại đây sau khi bạn mua khóa học.</p>
          </div>
        )}

        {!loading && !error && payments.length > 0 && (
          <div className="table-responsive">
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Mã giao dịch</th>
                  <th>Nội dung thanh toán</th>
                  <th>Phương thức</th>
                  <th>Thời gian</th>
                  <th>Số tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((item) => (
                  <tr key={item.transactionId}>
                    <td className="payment-code">{item.transactionId}</td>
                    <td className="payment-content">{item.content}</td>
                    <td className="payment-method">{item.method}</td>
                    <td className="payment-date">{item.date}</td>
                    <td className="payment-amount">{item.amount}</td>
                    <td>
                      <span className={`payment-badge payment-badge--${item.status === 'Thành công' ? 'success' : 'pending'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
