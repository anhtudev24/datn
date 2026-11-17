-- ==============================================================================
-- DATABASE SCHEMA TỐI ƯU GỌN GÀNG (10 BẢNG CỐT LÕI) - DỰ ÁN ĐỒ ÁN TỐT NGHIỆP
-- Hệ thống học lập trình trực tuyến E-Learning Platform
-- Tối ưu hóa: Giảm từ 22 bảng xuống đúng 10 bảng tinh gọn nhưng giữ trọn vẹn 100% 
-- các chức năng trên toàn bộ giao diện:
-- 1. users              : Người dùng, tài khoản, profile, đổi mật khẩu, phân quyền
-- 2. categories         : Danh mục khóa học (Front-end, Back-end, Fullstack, DevOps)
-- 3. courses            : Khóa học, giá bán, thời lượng, số học viên
-- 4. lessons            : Bài học & phân nhóm chương (kèm video, nội dung, học thử)
-- 5. roadmaps           : Lộ trình nghề nghiệp (lưu steps & skills dạng JSON hiện đại)
-- 6. enrollments        : Tiến trình học tập & cấp chứng chỉ (Trang "Khóa học của tôi")
-- 7. orders             : Đơn hàng & Lịch sử thanh toán giao dịch (Gộp orders & payments)
-- 8. articles           : Bảng tin công nghệ, bài viết chia sẻ (lưu tags dạng JSON)
-- 9. article_comments   : Bình luận và trao đổi thảo luận dưới bài viết
-- 10. notifications     : Thông báo chuông Header & Nhật ký hoạt động (Trang "Hoạt động")
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `datn_learning_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `datn_learning_db`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `article_comments`;
DROP TABLE IF EXISTS `articles`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `enrollments`;
DROP TABLE IF EXISTS `roadmaps`;
DROP TABLE IF EXISTS `lessons`;
DROP TABLE IF EXISTS `courses`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- 1. BẢNG NGƯỜI DÙNG (USERS)
-- ==============================================================================
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT 'Họ và tên người dùng',
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Tên định danh @username',
  `email` VARCHAR(150) NOT NULL UNIQUE COMMENT 'Email đăng nhập',
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Mật khẩu mã hóa bcrypt',
  `phone` VARCHAR(20) NULL COMMENT 'Số điện thoại',
  `avatar_url` VARCHAR(255) NULL COMMENT 'Ảnh đại diện',
  `bio` TEXT NULL COMMENT 'Giới thiệu bản thân',
  `role` ENUM('student', 'instructor', 'admin') DEFAULT 'student' COMMENT 'Phân quyền',
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 2. BẢNG DANH MỤC (CATEGORIES)
-- ==============================================================================
CREATE TABLE `categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT 'Tên danh mục (Front-end, Back-end...)',
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL,
  `icon` VARCHAR(50) NULL,
  `order_index` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 3. BẢNG KHÓA HỌC (COURSES)
-- ==============================================================================
CREATE TABLE `courses` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT UNSIGNED NULL,
  `instructor_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(200) NOT NULL COMMENT 'Tên khóa học',
  `slug` VARCHAR(220) NOT NULL UNIQUE,
  `description` TEXT NULL COMMENT 'Mô tả ngắn',
  `content` LONGTEXT NULL COMMENT 'Nội dung chi tiết',
  `thumbnail_url` VARCHAR(255) NULL,
  `price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'Giá bán (0 là miễn phí)',
  `original_price` DECIMAL(12, 2) NULL COMMENT 'Giá gốc trước giảm giá',
  `level` ENUM('beginner', 'intermediate', 'advanced', 'all') DEFAULT 'all',
  `total_duration_hours` INT DEFAULT 0 COMMENT 'Ước lượng tổng số giờ học',
  `total_lessons_count` INT DEFAULT 0 COMMENT 'Tổng số bài học',
  `students_count` INT DEFAULT 0 COMMENT 'Số học viên đã đăng ký',
  `is_published` BOOLEAN DEFAULT TRUE,
  `is_featured` BOOLEAN DEFAULT FALSE COMMENT 'Hiển thị nổi bật trang chủ',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_courses_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_courses_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_courses_slug` (`slug`),
  INDEX `idx_courses_featured` (`is_featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 4. BẢNG BÀI HỌC (LESSONS)
-- Tối ưu: Bổ sung `section_name` trực tiếp để gom nhóm chương mà không cần bảng phụ
-- ==============================================================================
CREATE TABLE `lessons` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `course_id` BIGINT UNSIGNED NOT NULL,
  `section_name` VARCHAR(150) NOT NULL DEFAULT 'Chương 1: Tổng quan' COMMENT 'Tên chương học',
  `title` VARCHAR(200) NOT NULL COMMENT 'Tên bài học',
  `slug` VARCHAR(220) NOT NULL,
  `video_url` VARCHAR(255) NULL COMMENT 'Link video bài giảng',
  `content` LONGTEXT NULL COMMENT 'Nội dung lý thuyết/bài tập',
  `duration_seconds` INT DEFAULT 0 COMMENT 'Thời lượng video (giây)',
  `order_index` INT DEFAULT 1 COMMENT 'Thứ tự trong chương',
  `is_free_preview` BOOLEAN DEFAULT FALSE COMMENT 'Cho phép học thử',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_lessons_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  INDEX `idx_lessons_course` (`course_id`, `order_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 5. BẢNG LỘ TRÌNH HỌC (ROADMAPS)
-- Tối ưu: Lưu trữ các chặng (steps) và kỹ năng (skills) dưới dạng JSON hiện đại
-- ==============================================================================
CREATE TABLE `roadmaps` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL COMMENT 'Ví dụ: Lộ trình học Front-end',
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `tag_badge` VARCHAR(50) NOT NULL COMMENT 'Nhãn: Front-end Developer, DevOps...',
  `description` TEXT NOT NULL COMMENT 'Mô tả định hướng lộ trình',
  `courses_count` INT DEFAULT 0 COMMENT 'Số lượng khóa học trong lộ trình',
  `hours_count` VARCHAR(50) DEFAULT '100+' COMMENT 'Ước tính số giờ',
  `projects_count` INT DEFAULT 0 COMMENT 'Số dự án thực chiến',
  `steps_json` JSON NOT NULL COMMENT 'Danh sách các chặng học [ {step: 1, title: "..."}, ... ]',
  `skills_json` JSON NOT NULL COMMENT 'Danh sách kỹ năng [ "HTML5", "CSS3", "React.js", ... ]',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 6. BẢNG TIẾN TRÌNH HỌC TẬP (ENROLLMENTS)
-- Tối ưu: Tích hợp bài học dở và mã chứng nhận hoàn thành (Trang Khóa học của tôi)
-- ==============================================================================
CREATE TABLE `enrollments` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `course_id` BIGINT UNSIGNED NOT NULL,
  `status` ENUM('in_progress', 'completed', 'dropped') DEFAULT 'in_progress',
  `progress_percent` DECIMAL(5, 2) DEFAULT 0.00 COMMENT 'Phần trăm tiến độ (0 - 100%)',
  `completed_lessons_count` INT DEFAULT 0 COMMENT 'Số bài học đã xem',
  `current_lesson_title` VARCHAR(255) NULL COMMENT 'Bài học đang học dở gần nhất',
  `certificate_code` VARCHAR(50) NULL UNIQUE COMMENT 'Mã chứng chỉ nếu đã hoàn thành (100%)',
  `enrolled_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `completed_at` DATETIME NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_enrollment_user_course` (`user_id`, `course_id`),
  CONSTRAINT `fk_enrollments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_enrollments_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 7. BẢNG ĐƠN HÀNG & THANH TOÁN (ORDERS)
-- Tối ưu: Gộp đơn hàng và lịch sử thanh toán thành 1 bảng duy nhất
-- Phục vụ cả 2 trang: "Đơn hàng của tôi" & "Lịch sử thanh toán"
-- ==============================================================================
CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã đơn hàng: DH-84920, DH-81203...',
  `transaction_code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã giao dịch ngân hàng: TXN-902814...',
  `user_id` BIGINT UNSIGNED NOT NULL,
  `course_id` BIGINT UNSIGNED NOT NULL COMMENT 'Khóa học được mua',
  `amount` DECIMAL(12, 2) NOT NULL COMMENT 'Số tiền thanh toán thực tế',
  `original_amount` DECIMAL(12, 2) NULL COMMENT 'Giá gốc trước khi giảm',
  `payment_method` VARCHAR(50) NOT NULL COMMENT 'VNPay QR, Chuyển khoản (Vietcombank), MoMo...',
  `payment_content` VARCHAR(255) NOT NULL COMMENT 'Nội dung giao dịch chuyển khoản',
  `status` ENUM('completed', 'pending', 'failed', 'refunded') DEFAULT 'completed' COMMENT 'Trạng thái đơn hàng',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_orders_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  INDEX `idx_orders_user` (`user_id`),
  INDEX `idx_orders_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 8. BẢNG BÀI VIẾT BẢNG TIN (ARTICLES)
-- Tối ưu: Lưu tags trực tiếp bằng JSON [ "React.js", "Performance" ] không cần bảng nối
-- Phục vụ trang "Bảng tin cộng đồng"
-- ==============================================================================
CREATE TABLE `articles` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `author_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL COMMENT 'Tiêu đề bài viết',
  `slug` VARCHAR(280) NOT NULL UNIQUE,
  `summary` TEXT NOT NULL COMMENT 'Mô tả tóm tắt ngắn',
  `content` LONGTEXT NOT NULL COMMENT 'Nội dung chi tiết bài viết',
  `thumbnail_url` VARCHAR(255) NULL,
  `category` ENUM('frontend', 'backend', 'devops', 'career', 'tips') NOT NULL DEFAULT 'frontend',
  `read_time_minutes` INT DEFAULT 5 COMMENT 'Thời gian ước tính đọc',
  `tags_json` JSON NOT NULL COMMENT 'Mảng tags: ["Node.js", "TypeScript", "Architecture"]',
  `views_count` INT DEFAULT 0,
  `likes_count` INT DEFAULT 0,
  `comments_count` INT DEFAULT 0,
  `is_published` BOOLEAN DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_articles_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_articles_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 9. BẢNG BÌNH LUẬN BÀI VIẾT (ARTICLE_COMMENTS)
-- ==============================================================================
CREATE TABLE `article_comments` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `article_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `parent_id` BIGINT UNSIGNED NULL COMMENT 'Hỗ trợ reply bình luận lồng nhau',
  `content` TEXT NOT NULL COMMENT 'Nội dung bình luận',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_comments_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comments_parent` FOREIGN KEY (`parent_id`) REFERENCES `article_comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 10. BẢNG THÔNG BÁO & HOẠT ĐỘNG (NOTIFICATIONS)
-- Tối ưu: Kết hợp 2 chức năng vào 1 bảng duy nhất:
-- - `type = 'notification'`: Hiển thị ở Popup Chuông thông báo trên Header
-- - `type = 'activity'`    : Hiển thị ở Timeline trang "Hoạt động" (ActivitiesPage)
-- ==============================================================================
CREATE TABLE `notifications` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `type` ENUM('notification', 'activity') NOT NULL DEFAULT 'notification',
  `title` VARCHAR(255) NOT NULL COMMENT 'Tiêu đề thông báo / hoạt động',
  `content` TEXT NULL COMMENT 'Nội dung chi tiết',
  `course_name` VARCHAR(150) NULL COMMENT 'Tên khóa học liên quan',
  `link_url` VARCHAR(255) NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_notif_user_type` (`user_id`, `type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================================================
-- DỮ LIỆU KHỞI TẠO MẪU (SEED DATA - 10 BẢNG)
-- Khớp 100% với giao diện đang chạy thực tế
-- ==============================================================================

-- 1. Người dùng mẫu
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `bio`, `role`) VALUES
(1, 'Anh Tú', 'tuanhifmzc', 'anhtu@example.com', '$2b$10$wT8K89gq1pB1Z5eYpZ7O3.7lFwK5dFvM0/fGfE08K2lWwR3yI8mS2', '0987654321', 'Học viên đam mê lập trình Fullstack Web', 'student'),
(2, 'Sơn Đặng', 'sondang', 'sondang@f8.edu.vn', '$2b$10$wT8K89gq1pB1Z5eYpZ7O3.7lFwK5dFvM0/fGfE08K2lWwR3yI8mS2', '0912345678', 'Founder & Giảng viên tại Học Lập Trình Để Đi Làm', 'instructor'),
(3, 'Minh Quân', 'minhquan', 'minhquan@example.com', '$2b$10$wT8K89gq1pB1Z5eYpZ7O3.7lFwK5dFvM0/fGfE08K2lWwR3yI8mS2', '0933221100', 'Senior Backend Engineer & Technical Mentor', 'instructor');

-- 2. Danh mục
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon`, `order_index`) VALUES
(1, 'Lập trình Front-end', 'lap-trinh-front-end', 'Xây dựng giao diện web tương tác', 'layout', 1),
(2, 'Lập trình Back-end', 'lap-trinh-back-end', 'Xử lý logic, cơ sở dữ liệu và hệ thống server', 'server', 2),
(3, 'Fullstack Web', 'fullstack-web', 'Làm chủ toàn diện từ Front-end đến Back-end', 'layers', 3),
(4, 'DevOps & Cloud', 'devops-cloud', 'Tự động hóa CI/CD và quản trị đám mây', 'cloud', 4);

-- 3. Khóa học mẫu
INSERT INTO `courses` (`id`, `category_id`, `instructor_id`, `title`, `slug`, `description`, `thumbnail_url`, `price`, `original_price`, `level`, `total_duration_hours`, `total_lessons_count`, `students_count`, `is_published`, `is_featured`) VALUES
(1, 3, 2, 'Lập trình Fullstack Web Developer Chuyên Nghiệp', 'fullstack-web-developer', 'Khóa học đào tạo Fullstack Web thực chiến, xây dựng dự án quy mô doanh nghiệp từ nền tảng đến production.', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80', 1299000.00, 2500000.00, 'all', 120, 68, 12450, TRUE, TRUE),
(2, 2, 3, 'Xây dựng RESTful API với Node.js, Express & MongoDB', 'restful-api-nodejs-mongodb', 'Nắm vững tư duy thiết kế API chuẩn mực, kiến trúc MVC, xác thực JWT và tối ưu truy vấn dữ liệu.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80', 899000.00, 1500000.00, 'intermediate', 45, 40, 8920, TRUE, TRUE),
(3, 1, 2, 'Lập trình JavaScript Nâng Cao (ES6+ & Asynchronous)', 'javascript-nang-cao', 'Làm chủ bất đồng bộ (Promise, Async/Await), Scope, Closure, Prototype và các tính năng ES6+ hiện đại.', 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&q=80', 699000.00, 1200000.00, 'intermediate', 35, 32, 18320, TRUE, FALSE),
(4, 1, 2, 'Xây dựng giao diện hiện đại với React.js & Tailwind CSS', 'reactjs-tailwind-css', 'Học React.js từ cơ bản đến nâng cao, làm chủ React Hooks, Context API và xây dựng UI thần tốc với Tailwind.', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80', 990000.00, 1800000.00, 'all', 55, 52, 14210, TRUE, TRUE);

-- 4. Bài học mẫu (kèm tên chương section_name)
INSERT INTO `lessons` (`id`, `course_id`, `section_name`, `title`, `slug`, `duration_seconds`, `order_index`, `is_free_preview`) VALUES
(1, 1, 'Chương 1: Khởi động & Cài đặt môi trường Fullstack', 'Bài 1: Giới thiệu tổng quan kiến trúc Fullstack', 'gioi-thieu-kien-truc-fullstack', 720, 1, TRUE),
(2, 1, 'Chương 1: Khởi động & Cài đặt môi trường Fullstack', 'Bài 2: Cài đặt Node.js, Express và kết nối Database', 'cai-dat-moi-truong', 900, 2, TRUE),
(3, 1, 'Chương 2: Thiết kế Database & Xây dựng Backend Core', 'Bài 3: Thiết kế Schema chuẩn 3NF và tối ưu Index', 'thiet-ke-schema', 1200, 3, FALSE),
(4, 1, 'Chương 3: Xác thực người dùng & Bảo mật hệ thống', 'Bài 47: Tích hợp xác thực JWT & Cookie Refresh Token', 'xac-thuc-jwt-refresh-token', 1450, 4, FALSE);

-- 5. Lộ trình nghề nghiệp mẫu (Trang Lộ trình)
INSERT INTO `roadmaps` (`id`, `title`, `slug`, `tag_badge`, `description`, `courses_count`, `hours_count`, `projects_count`, `steps_json`, `skills_json`) VALUES
(1, 'Lộ trình học Front-end', 'lo-trinh-front-end', 'Front-end Developer', 'Lập trình viên Front-end là người xây dựng toàn bộ giao diện website và ứng dụng web trực quan, tương tác trực tiếp với người dùng cuối.', 8, '120+', 4,
 '[{"num": 1, "title": "Nền tảng: HTML5, CSS3 & Responsive Design"}, {"num": 2, "title": "Lập trình JavaScript cơ bản đến ES6+ hiện đại"}, {"num": 3, "title": "Xây dựng UI với React.js, Vite & Tailwind CSS"}, {"num": 4, "title": "Quản lý state nâng cao & Tối ưu hiệu năng"}]',
 '["HTML5", "CSS3", "JavaScript", "React.js", "Next.js", "Tailwind CSS", "TypeScript", "Git/GitHub"]'),
(2, 'Lộ trình học Back-end', 'lo-trinh-back-end', 'Back-end Developer', 'Lập trình viên Back-end chịu trách nhiệm xử lý logic nghiệp vụ, thiết kế cơ sở dữ liệu, xây dựng RESTful/GraphQL API và vận hành hệ thống máy chủ.', 10, '150+', 5,
 '[{"num": 1, "title": "Kiến thức mạng máy tính, HTTP/HTTPS & Terminal"}, {"num": 2, "title": "Lập trình Node.js, Express.js & Kiến trúc MVC"}, {"num": 3, "title": "Cơ sở dữ liệu quan hệ (PostgreSQL) & NoSQL (MongoDB, Redis)"}, {"num": 4, "title": "Bảo mật API, Authentication (JWT, OAuth) & Microservices"}]',
 '["Node.js", "Express", "PostgreSQL", "MongoDB", "Redis", "RESTful API", "JWT", "Docker"]'),
(3, 'Lộ trình học Fullstack Web', 'lo-trinh-fullstack', 'Fullstack Developer', 'Làm chủ toàn diện cả giao diện Front-end và hệ thống Back-end. Tự tay thiết kế, xây dựng và đưa sản phẩm thực tế lên môi trường Internet.', 14, '220+', 6,
 '[{"num": 1, "title": "Làm chủ Front-end hiện đại với React.js & TypeScript"}, {"num": 2, "title": "Xây dựng Server backend mạnh mẽ với Node.js & Database"}, {"num": 3, "title": "Tích hợp thanh toán, WebSocket thời gian thực & Cloud upload"}, {"num": 4, "title": "Đóng gói Docker, thiết lập CI/CD & Triển khai Production"}]',
 '["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS", "Socket.io", "CI/CD"]'),
(4, 'Lộ trình học DevOps', 'lo-trinh-devops', 'DevOps & Cloud Engineer', 'Tự động hóa quy trình phát hành phần mềm, quản lý hạ tầng đám mây dạng mã (IaC), giám sát hệ thống và đảm bảo độ sẵn sàng cao.', 7, '110+', 4,
 '[{"num": 1, "title": "Quản trị hệ điều hành Linux & Bash Scripting chuyên sâu"}, {"num": 2, "title": "Containerization với Docker & Quản lý nhiều container"}, {"num": 3, "title": "Điều phối cụm máy chủ với Kubernetes (K8s)"}, {"num": 4, "title": "Xây dựng pipeline CI/CD tự động & Quản lý đám mây AWS"}]',
 '["Linux", "Docker", "Kubernetes", "GitHub Actions", "AWS/GCP", "Terraform", "Prometheus", "Nginx"]');

-- 6. Đăng ký & Tiến độ học tập của Anh Tú (Trang "Khóa học của tôi")
INSERT INTO `enrollments` (`id`, `user_id`, `course_id`, `status`, `progress_percent`, `completed_lessons_count`, `current_lesson_title`, `certificate_code`) VALUES
(1, 1, 1, 'in_progress', 68.00, 46, 'Bài 47: Tích hợp xác thực JWT & Cookie Refresh Token', NULL),
(2, 1, 2, 'in_progress', 35.00, 14, 'Bài 15: Thiết kế schema với Mongoose & Quan hệ dữ liệu', NULL),
(3, 1, 3, 'completed', 100.00, 32, 'Đã hoàn thành toàn bộ khóa học', 'CERT-2026-F8902JS');

-- 7. Đơn hàng & Thanh toán (Trang "Đơn hàng của tôi" & "Lịch sử thanh toán")
INSERT INTO `orders` (`id`, `order_code`, `transaction_code`, `user_id`, `course_id`, `amount`, `original_amount`, `payment_method`, `payment_content`, `status`, `created_at`) VALUES
(1, 'DH-84920', 'TXN-902814', 1, 1, 1299000.00, 2500000.00, 'VNPay QR', 'Thanh toán khóa học Fullstack Web Developer', 'completed', '2026-11-15 14:32:10'),
(2, 'DH-81203', 'TXN-831902', 1, 3, 699000.00, 1200000.00, 'Chuyển khoản (Vietcombank)', 'Thanh toán khóa học Javascript Nâng Cao', 'completed', '2026-10-02 09:15:44');

-- 8. Bài viết Bảng tin cộng đồng (Trang "Bảng tin")
INSERT INTO `articles` (`id`, `author_id`, `title`, `slug`, `summary`, `content`, `thumbnail_url`, `category`, `read_time_minutes`, `tags_json`, `views_count`, `likes_count`, `comments_count`) VALUES
(1, 2, 'Xây dựng kiến trúc Clean Architecture với Node.js & TypeScript', 'clean-architecture-nodejs-typescript', 'Phân tách rành mạch các lớp Controller, Service, Repository giúp mã nguồn dễ mở rộng, bảo trì và viết Unit Test hiệu quả trong dự án lớn.', '# Nội dung chi tiết bài viết...', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80', 'backend', 6, '["Node.js", "TypeScript", "Architecture"]', 3420, 184, 29),
(2, 1, 'Tối ưu hóa Performance trong React 18: useMemo, useCallback & useTransition', 'toi-uu-performance-react-18', 'Khi nào bạn thực sự cần tối ưu render? Phân tích các trường hợp lạm dụng memo hóa và cách sử dụng Concurrent Features để UI luôn mượt mà.', '# Nội dung chi tiết bài viết...', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80', 'frontend', 8, '["React.js", "Performance", "Hooks"]', 4850, 312, 45);

-- 9. Bình luận bài viết
INSERT INTO `article_comments` (`id`, `article_id`, `user_id`, `parent_id`, `content`) VALUES
(1, 1, 1, NULL, 'Bài viết rất chi tiết và thực tế, cảm ơn tác giả đã chia sẻ!'),
(2, 1, 2, 1, 'Cảm ơn Tú đã đọc và ủng hộ bài viết nhé!');

-- 10. Thông báo & Nhật ký hoạt động
-- Gồm cả popup Chuông thông báo (type=notification) và Hoạt động (type=activity)
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `content`, `course_name`, `created_at`) VALUES
(1, 1, 'activity', 'Hoàn thành bài tập: React Custom Hooks & Context API', 'Đã nộp bài tập và vượt qua các test cases', 'Fullstack Web Developer', NOW() - INTERVAL 2 HOUR),
(2, 1, 'activity', 'Đăng ký thành công khóa học Lập trình Javascript Nâng Cao', 'Kích hoạt quyền truy cập trọn đời', 'Javascript Advanced', NOW() - INTERVAL 3 DAY),
(3, 1, 'activity', 'Nhận chứng chỉ hoàn thành khóa học Javascript', 'Chứng chỉ điện tử CERT-2026-F8902JS', 'Javascript Advanced', NOW() - INTERVAL 7 DAY),
(4, 1, 'notification', 'Chào mừng bạn tham gia nền tảng học tập', 'Hãy bắt đầu lộ trình học tập đầu tiên của bạn ngay hôm nay.', NULL, NOW() - INTERVAL 10 DAY);
