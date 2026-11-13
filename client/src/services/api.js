import axios from 'axios';

// Khởi tạo instance của Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor cho Request: tự động đính kèm token nếu đã đăng nhập
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor cho Response: xử lý lỗi chung (401, 403, 500)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Ví dụ: Xóa token khi hết hạn và điều hướng về login
      localStorage.removeItem('token');
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;
