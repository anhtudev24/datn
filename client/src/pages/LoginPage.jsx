import React, { useState } from 'react';
import api from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      setMessage(`✅ ${response.message}`);
    } catch (error) {
      setMessage(`❌ ${error.message || 'Đăng nhập thất bại!'}`);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            placeholder="******"
          />
        </div>

        <button type="submit" className="btn">
          Đăng nhập
        </button>
      </form>

      {message && (
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f1f5f9', borderRadius: '4px' }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default LoginPage;
