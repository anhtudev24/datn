import React from 'react';
import './UserPages.css';

const MOCK_PAYMENTS = [
  {
    transactionId: 'TXN-902814',
    content: 'Thanh toán khóa học Fullstack Web Developer',
    amount: '1.299.000 đ',
    method: 'VNPay QR',
    date: '15/11/2026 14:32:10',
    status: 'Thành công',
  },
  {
    transactionId: 'TXN-831902',
    content: 'Thanh toán khóa học Javascript Nâng Cao',
    amount: '699.000 đ',
    method: 'Chuyển khoản (Vietcombank)',
    date: '02/10/2026 09:15:44',
    status: 'Thành công',
  },
];

const PaymentHistoryPage = () => {
  return (
    <div className="user-page">
      <div className="user-page__container">
        <div className="user-page__header">
          <h1 className="user-page__title">Lịch sử thanh toán</h1>
          <p className="user-page__subtitle">Theo dõi các giao dịch thanh toán và hóa đơn điện tử của bạn</p>
        </div>

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
              {MOCK_PAYMENTS.map((item) => (
                <tr key={item.transactionId}>
                  <td className="payment-code">{item.transactionId}</td>
                  <td className="payment-content">{item.content}</td>
                  <td className="payment-method">{item.method}</td>
                  <td className="payment-date">{item.date}</td>
                  <td className="payment-amount">{item.amount}</td>
                  <td>
                    <span className="payment-badge payment-badge--success">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
