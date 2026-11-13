# Đồ Án Tốt Nghiệp (Graduation Project)

Dự án gồm 2 phần tách biệt: **Frontend (React)** và **Backend (Node.js/Express)**.

---

## 📁 Cấu Trúc Thư Mục

```text
DATN/
├── client/                     # Frontend: React.js (Vite)
│   ├── public/                 # Static assets công khai
│   ├── src/
│   │   ├── assets/             # Hình ảnh, font, css chung
│   │   ├── components/         # Các React component dùng lại
│   │   │   ├── common/         # Component cơ bản (Button, Input, Modal, ...)
│   │   │   └── layout/         # Component bố cục (Navbar, Footer, Sidebar, ...)
│   │   ├── contexts/           # React Context (AuthContext, CartContext, ...)
│   │   ├── hooks/              # Custom React Hooks
│   │   ├── pages/              # Các trang giao diện (Home, Login, Register, ...)
│   │   ├── routes/             # Cấu hình định tuyến (react-router-dom)
│   │   ├── services/           # Gọi API qua Axios
│   │   ├── utils/              # Helper functions, constants
│   │   ├── App.jsx             # Component App chính
│   │   ├── App.css             # Style chung cho App
│   │   ├── main.jsx            # Điểm vào chính của React
│   │   └── index.css           # Global CSS
│   ├── .env.example            # Mẫu biến môi trường FE
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend: Node.js (Express.js)
│   ├── src/
│   │   ├── config/             # Cấu hình kết nối Database, môi trường
│   │   │   └── db.js
│   │   ├── controllers/        # Điều khiển logic request/response
│   │   │   └── authController.js
│   │   ├── middlewares/        # Middlewares (Auth, Error handling, Upload, ...)
│   │   │   └── errorHandler.js
│   │   ├── models/             # Schema Database (MongoDB / MySQL / ...)
│   │   ├── routes/             # Định nghĩa API routes
│   │   │   ├── authRoutes.js
│   │   │   └── index.js
│   │   ├── services/           # Business logic
│   │   ├── utils/              # Tiện ích bổ trợ (token, hash password, ...)
│   │   ├── app.js              # Khởi tạo Express app & middlewares
│   │   └── server.js           # Điểm vào chính, khởi chạy server & DB
│   ├── .env.example            # Mẫu biến môi trường BE
│   ├── .gitignore
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Khởi chạy Backend (`server`)

1. Mở terminal và chuyển vào thư mục `server`:
   ```bash
   cd server
   ```
2. Cài đặt các thư viện cần thiết:
   ```bash
   npm install
   ```
3. Tạo file cấu hình môi trường `.env`:
   ```bash
   cp .env.example .env
   # Hoặc trên Windows PowerShell:
   copy .env.example .env
   ```
4. Chạy server ở chế độ phát triển (Development):
   ```bash
   npm run dev
   ```
   > Server mặc định chạy tại: **http://localhost:5000**  
   > Endpoint kiểm tra: **http://localhost:5000/api/v1/health**

---

### 2. Khởi chạy Frontend (`client`)

1. Mở một terminal mới và chuyển vào thư mục `client`:
   ```bash
   cd client
   ```
2. Cài đặt các thư viện:
   ```bash
   npm install
   ```
3. Tạo file cấu hình môi trường `.env`:
   ```bash
   cp .env.example .env
   # Hoặc trên Windows PowerShell:
   copy .env.example .env
   ```
4. Khởi chạy ứng dụng React (Vite):
   ```bash
   npm run dev
   ```
   > Ứng dụng client mặc định chạy tại: **http://localhost:5173**

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**:
  - React 18
  - Vite (công cụ build và dev server tốc độ cao)
  - React Router DOM v6 (quản lý chuyển trang)
  - Axios (giao tiếp HTTP client)
- **Backend**:
  - Node.js (ES Modules `import/export`)
  - Express.js (RESTful API Framework)
  - CORS, Dotenv, Nodemon
- **Database gợi ý**:
  - MongoDB (sử dụng thư viện `mongoose`)
  - MySQL / PostgreSQL (sử dụng `sequelize` hoặc `prisma`)
