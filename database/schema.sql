-- ==============================================================================
-- DATABASE SCHEMA TỐI ƯU 10 BẢNG CỐT LÕI - DỰ ÁN HỆ THỐNG E-LEARNING (DATN)
-- Kết nối: MySQL Workbench localhost:3060 | user: root | password: 1234
-- Database name: datn_learning_db
-- 
-- Danh sách 10 bảng chuẩn hóa:
-- 1.  users             : Người dùng (Học viên, Giảng viên, Admin)
-- 2.  categories        : Danh mục phân loại khóa học (Front-end, Back-end, Fullstack, DevOps)
-- 3.  courses           : Khóa học trực tuyến (Khóa ngoại liên kết categories & users)
-- 4.  lessons           : Bài học & video (Gộp chương với trường section_name)
-- 5.  roadmaps          : Lộ trình nghề nghiệp (Lưu JSON: steps_json, skills_json)
-- 6.  enrollments       : Khóa học của tôi (Tiến độ %, bài học dở, mã chứng chỉ)
-- 7.  orders            : Đơn hàng & Lịch sử thanh toán (Mã đơn, mã giao dịch, cổng TT)
-- 8.  articles          : Bảng tin công nghệ (Lưu JSON tags_json)
-- 9.  article_comments  : Thảo luận & bình luận (Hỗ trợ trả lời lồng nhau qua parent_id)
-- 10. notifications     : Chuông thông báo Header & Nhật ký trang Hoạt động
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
-- Quản lý học viên, giảng viên và admin qua ENUM('student', 'instructor', 'admin')
-- Phục vụ: Đăng nhập, Đăng ký, Trang cá nhân, Đổi mật khẩu, Phân quyền
-- ==============================================================================
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT 'Họ và tên người dùng',
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Tên định danh duy nhất @username',
  `email` VARCHAR(150) NOT NULL UNIQUE COMMENT 'Email đăng nhập hệ thống',
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Mật khẩu mã hóa bcrypt',
  `phone` VARCHAR(20) NULL COMMENT 'Số điện thoại liên hệ',
  `avatar_url` VARCHAR(255) NULL COMMENT 'URL ảnh đại diện',
  `bio` TEXT NULL COMMENT 'Tiểu sử giới thiệu bản thân',
  `role` ENUM('student', 'instructor', 'admin') DEFAULT 'student' COMMENT 'Phân quyền tài khoản',
  `is_active` BOOLEAN DEFAULT TRUE COMMENT 'Trạng thái hoạt động tài khoản',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 2. BẢNG DANH MỤC (CATEGORIES)
-- Danh mục phân loại linh hoạt theo slug (Front-end, Back-end, Fullstack, DevOps)
-- ==============================================================================
CREATE TABLE `categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT 'Tên danh mục hiển thị',
  `slug` VARCHAR(120) NOT NULL UNIQUE COMMENT 'Định danh URL thân thiện',
  `description` VARCHAR(255) NULL COMMENT 'Mô tả ngắn gọn danh mục',
  `icon` VARCHAR(50) NULL COMMENT 'Mã icon đại diện',
  `order_index` INT DEFAULT 0 COMMENT 'Thứ tự ưu tiên hiển thị',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 3. BẢNG KHÓA HỌC (COURSES)
-- Hiển thị Trang chủ, Khóa học nổi bật, Khóa miễn phí, Khóa chuyên sâu Pro
-- Khóa ngoại liên kết categories(id) và users(id)
-- ==============================================================================
CREATE TABLE `courses` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT UNSIGNED NULL COMMENT 'Khóa ngoại danh mục',
  `instructor_id` BIGINT UNSIGNED NOT NULL COMMENT 'Khóa ngoại giảng viên phụ trách',
  `title` VARCHAR(200) NOT NULL COMMENT 'Tên khóa học',
  `slug` VARCHAR(220) NOT NULL UNIQUE COMMENT 'Slug đường dẫn khóa học',
  `description` TEXT NULL COMMENT 'Mô tả ngắn về khóa học',
  `content` LONGTEXT NULL COMMENT 'Nội dung chi tiết khóa học',
  `thumbnail_url` VARCHAR(255) NULL COMMENT 'Ảnh thumbnail minh họa',
  `price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'Giá bán (0.00 là miễn phí)',
  `original_price` DECIMAL(12, 2) NULL COMMENT 'Giá gốc trước khi giảm',
  `level` ENUM('beginner', 'intermediate', 'advanced', 'all') DEFAULT 'all' COMMENT 'Cấp độ học viên',
  `total_duration_hours` INT DEFAULT 0 COMMENT 'Ước lượng tổng số giờ học',
  `total_lessons_count` INT DEFAULT 0 COMMENT 'Tổng số lượng bài học',
  `students_count` INT DEFAULT 0 COMMENT 'Số học viên đã tham gia',
  `is_published` BOOLEAN DEFAULT TRUE COMMENT 'Trạng thái phát hành',
  `is_featured` BOOLEAN DEFAULT FALSE COMMENT 'Đánh dấu hiển thị Khóa học nổi bật',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_courses_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_courses_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_courses_slug` (`slug`),
  INDEX `idx_courses_featured` (`is_featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 4. BẢNG BÀI HỌC (LESSONS)
-- Tối ưu: Thêm trường section_name trực tiếp ("Chương 1...", "Chương 2..."),
-- loại bỏ hoàn toàn bảng phụ course_sections
-- ==============================================================================
CREATE TABLE `lessons` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `course_id` BIGINT UNSIGNED NOT NULL COMMENT 'Khóa ngoại khóa học',
  `section_name` VARCHAR(150) NOT NULL DEFAULT 'Chương 1: Tổng quan' COMMENT 'Tên chương học gom nhóm',
  `title` VARCHAR(200) NOT NULL COMMENT 'Tên bài học',
  `slug` VARCHAR(220) NOT NULL COMMENT 'Slug bài học',
  `video_url` VARCHAR(255) NULL COMMENT 'Đường dẫn video bài giảng',
  `content` LONGTEXT NULL COMMENT 'Nội dung bài học hoặc tài liệu đính kèm',
  `duration_seconds` INT DEFAULT 0 COMMENT 'Thời lượng video (tính theo giây)',
  `order_index` INT DEFAULT 1 COMMENT 'Thứ tự bài học trong chương',
  `is_free_preview` BOOLEAN DEFAULT FALSE COMMENT 'Cho phép xem thử miễn phí',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_lessons_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  INDEX `idx_lessons_course` (`course_id`, `order_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 5. BẢNG LỘ TRÌNH NGHỀ NGHIỆP (ROADMAPS)
-- Trang Lộ trình (/lo-trinh)
-- Tối ưu: Lưu các chặng học (steps_json) và kỹ năng (skills_json) dạng JSON,
-- loại bỏ 3 bảng phụ trung gian
-- ==============================================================================
CREATE TABLE `roadmaps` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL COMMENT 'Tên lộ trình: Lộ trình học Front-end...',
  `slug` VARCHAR(150) NOT NULL UNIQUE COMMENT 'Đường dẫn URL lộ trình',
  `tag_badge` VARCHAR(50) NOT NULL COMMENT 'Nhãn thẻ: Front-end Developer, DevOps...',
  `description` TEXT NOT NULL COMMENT 'Mô tả chi tiết định hướng nghề nghiệp',
  `courses_count` INT DEFAULT 0 COMMENT 'Số khóa học thuộc lộ trình',
  `hours_count` VARCHAR(50) DEFAULT '100+' COMMENT 'Ước lượng thời gian học',
  `projects_count` INT DEFAULT 0 COMMENT 'Số dự án thực chiến chuẩn CV',
  `steps_json` JSON NOT NULL COMMENT 'Mảng các chặng học [{"num": 1, "title": "..."}]',
  `skills_json` JSON NOT NULL COMMENT 'Mảng kỹ năng tích lũy ["HTML5", "CSS3", ...]',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 6. BẢNG TIẾN TRÌNH HỌC TẬP (ENROLLMENTS)
-- Trang Khóa học của tôi (/khoa-hoc-cua-toi)
-- Tích hợp Chứng chỉ: Lưu tiến độ %, bài học dở (current_lesson_title)
-- và mã chứng chỉ (certificate_code) trực tiếp
-- ==============================================================================
CREATE TABLE `enrollments` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'Khóa ngoại học viên',
  `course_id` BIGINT UNSIGNED NOT NULL COMMENT 'Khóa ngoại khóa học',
  `status` ENUM('in_progress', 'completed', 'dropped') DEFAULT 'in_progress' COMMENT 'Trạng thái học tập',
  `progress_percent` DECIMAL(5, 2) DEFAULT 0.00 COMMENT 'Tiến độ hoàn thành (0 - 100%)',
  `completed_lessons_count` INT DEFAULT 0 COMMENT 'Số bài học đã hoàn thành',
  `current_lesson_title` VARCHAR(255) NULL COMMENT 'Bài học đang học dở gần nhất',
  `certificate_code` VARCHAR(50) NULL UNIQUE COMMENT 'Mã chứng chỉ số nếu đạt 100%',
  `enrolled_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm đăng ký học',
  `completed_at` DATETIME NULL COMMENT 'Thời điểm tốt nghiệp nhận chứng chỉ',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_enrollment_user_course` (`user_id`, `course_id`),
  CONSTRAINT `fk_enrollments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_enrollments_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 7. BẢNG ĐƠN HÀNG & THANH TOÁN (ORDERS)
-- Phục vụ: Trang Đơn hàng của tôi (/my-orders) & Lịch sử thanh toán (/payment-history)
-- Gộp Đơn hàng & Thanh toán: Lưu mã đơn (DH-84920), mã giao dịch (TXN-902814),
-- cổng thanh toán và số tiền trong cùng 1 bảng duy nhất
-- ==============================================================================
CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã đơn hàng: DH-84920, DH-81203...',
  `transaction_code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã giao dịch ngân hàng: TXN-902814...',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'Khóa ngoại người mua',
  `course_id` BIGINT UNSIGNED NOT NULL COMMENT 'Khóa ngoại khóa học được kích hoạt',
  `amount` DECIMAL(12, 2) NOT NULL COMMENT 'Số tiền thanh toán thực tế',
  `original_amount` DECIMAL(12, 2) NULL COMMENT 'Giá gốc trước khi giảm',
  `payment_method` VARCHAR(50) NOT NULL COMMENT 'Phương thức: VNPay QR, Chuyển khoản, MoMo...',
  `payment_content` VARCHAR(255) NOT NULL COMMENT 'Nội dung giao dịch chuyển khoản',
  `status` ENUM('completed', 'pending', 'failed', 'refunded') DEFAULT 'completed' COMMENT 'Trạng thái đơn hàng',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_orders_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  INDEX `idx_orders_user` (`user_id`),
  INDEX `idx_orders_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 8. BẢNG BÀI VIẾT (ARTICLES)
-- Trang Bảng tin cộng đồng (/bang-tin)
-- Tận dụng JSON: Lưu mảng tags (tags_json: ["React.js", "Node.js"]),
-- loại bỏ 2 bảng phụ liên kết tags
-- ==============================================================================
CREATE TABLE `articles` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `author_id` BIGINT UNSIGNED NOT NULL COMMENT 'Khóa ngoại tác giả bài viết',
  `title` VARCHAR(255) NOT NULL COMMENT 'Tiêu đề bài viết',
  `slug` VARCHAR(280) NOT NULL UNIQUE COMMENT 'Đường dẫn bài viết',
  `summary` TEXT NOT NULL COMMENT 'Tóm tắt ngắn hiển thị ở danh sách',
  `content` LONGTEXT NOT NULL COMMENT 'Nội dung chi tiết bài viết',
  `thumbnail_url` VARCHAR(255) NULL COMMENT 'Ảnh đại diện bài viết',
  `category` ENUM('frontend', 'backend', 'devops', 'career', 'tips') NOT NULL DEFAULT 'frontend' COMMENT 'Danh mục bài viết',
  `read_time_minutes` INT DEFAULT 5 COMMENT 'Thời gian ước tính đọc',
  `tags_json` JSON NOT NULL COMMENT 'Mảng tags: ["Node.js", "TypeScript", "Architecture"]',
  `views_count` INT DEFAULT 0 COMMENT 'Lượt xem',
  `likes_count` INT DEFAULT 0 COMMENT 'Lượt thích',
  `comments_count` INT DEFAULT 0 COMMENT 'Tổng số bình luận',
  `is_published` BOOLEAN DEFAULT TRUE COMMENT 'Trạng thái hiển thị',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_articles_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_articles_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 9. BẢNG BÌNH LUẬN BÀI VIẾT (ARTICLE_COMMENTS)
-- Thảo luận và bình luận dưới bài viết
-- Hỗ trợ trả lời lồng nhau qua parent_id tự tham chiếu
-- ==============================================================================
CREATE TABLE `article_comments` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `article_id` BIGINT UNSIGNED NOT NULL COMMENT 'Khóa ngoại bài viết',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'Khóa ngoại người bình luận',
  `parent_id` BIGINT UNSIGNED NULL COMMENT 'Khóa ngoại tự tham chiếu để reply bình luận',
  `content` TEXT NOT NULL COMMENT 'Nội dung bình luận',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_comments_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comments_parent` FOREIGN KEY (`parent_id`) REFERENCES `article_comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 10. BẢNG THÔNG BÁO & HOẠT ĐỘNG (NOTIFICATIONS)
-- Phục vụ: Popup Chuông thông báo Header & Trang Hoạt động (/activities)
-- Tối ưu: Lưu trong 1 bảng duy nhất với ENUM('notification', 'activity')
-- ==============================================================================
CREATE TABLE `notifications` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'Khóa ngoại người nhận',
  `type` ENUM('notification', 'activity') NOT NULL DEFAULT 'notification' COMMENT 'notification = Chuông Header, activity = Timeline Hoạt động',
  `title` VARCHAR(255) NOT NULL COMMENT 'Tiêu đề thông báo / hoạt động',
  `content` TEXT NULL COMMENT 'Nội dung chi tiết',
  `course_name` VARCHAR(150) NULL COMMENT 'Tên khóa học liên quan',
  `link_url` VARCHAR(255) NULL COMMENT 'Đường dẫn chuyển hướng khi click',
  `is_read` BOOLEAN DEFAULT FALSE COMMENT 'Đã đọc hay chưa',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_notif_user_type` (`user_id`, `type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================================================
-- DỮ LIỆU KHỞI TẠO MẪU ĐẦY ĐỦ (SEED DATA CHO CẢ 10 BẢNG)
-- Khớp 100% với giao diện Client React thực tế
-- Mật khẩu mặc định của các tài khoản: 1234 hoặc 123456
-- Hash: $2b$10$wT8K89gq1pB1Z5eYpZ7O3.7lFwK5dFvM0/fGfE08K2lWwR3yI8mS2 (123456)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. BẢNG USERS (5 người dùng mẫu: student, instructor, admin)
-- ------------------------------------------------------------------------------
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `avatar_url`, `bio`, `role`) VALUES
(1, 'Anh Tú', 'tuanhifmzc', 'anhtu@example.com', '$2b$10$wT8K89gq1pB1Z5eYpZ7O3.7lFwK5dFvM0/fGfE08K2lWwR3yI8mS2', '0987654321', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80', 'Học viên đam mê lập trình Fullstack Web và kiến trúc phần mềm', 'student'),
(2, 'Sơn Đặng', 'sondang', 'sondang@f8.edu.vn', '$2b$10$wT8K89gq1pB1Z5eYpZ7O3.7lFwK5dFvM0/fGfE08K2lWwR3yI8mS2', '0912345678', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80', 'Founder & Giảng viên tại Học Lập Trình Để Đi Làm', 'instructor'),
(3, 'Minh Quân', 'minhquan', 'minhquan@example.com', '$2b$10$wT8K89gq1pB1Z5eYpZ7O3.7lFwK5dFvM0/fGfE08K2lWwR3yI8mS2', '0933221100', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', 'Senior Backend & DevOps Engineer, Technical Mentor', 'instructor'),
(4, 'Quản Trị Viên', 'admin_master', 'admin@example.com', '$2b$10$wT8K89gq1pB1Z5eYpZ7O3.7lFwK5dFvM0/fGfE08K2lWwR3yI8mS2', '0909998877', NULL, 'Hệ thống Quản trị viên cấp cao', 'admin'),
(5, 'Phương Linh', 'phuonglinh', 'phuonglinh@example.com', '$2b$10$wT8K89gq1pB1Z5eYpZ7O3.7lFwK5dFvM0/fGfE08K2lWwR3yI8mS2', '0966554433', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', 'Sinh viên năm cuối ngành Công nghệ thông tin', 'student');

-- ------------------------------------------------------------------------------
-- 2. BẢNG CATEGORIES (4 danh mục chính)
-- ------------------------------------------------------------------------------
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon`, `order_index`) VALUES
(1, 'Lập trình Front-end', 'lap-trinh-front-end', 'Xây dựng giao diện web hiện đại, chuẩn UI/UX và tương tác mượt mà', 'layout', 1),
(2, 'Lập trình Back-end', 'lap-trinh-back-end', 'Thiết kế hệ thống máy chủ, xử lý nghiệp vụ backend và cơ sở dữ liệu', 'server', 2),
(3, 'Fullstack Web', 'fullstack-web', 'Làm chủ toàn diện từ giao diện người dùng đến hệ thống máy chủ', 'layers', 3),
(4, 'DevOps & Cloud', 'devops-cloud', 'Tự động hóa CI/CD, Container hóa Docker/K8s và đám mây AWS', 'cloud', 4);

-- ------------------------------------------------------------------------------
-- 3. BẢNG COURSES (10 khóa học: Nổi bật, Có phí Pro, Miễn phí)
-- ------------------------------------------------------------------------------
INSERT INTO `courses` (`id`, `category_id`, `instructor_id`, `title`, `slug`, `description`, `thumbnail_url`, `price`, `original_price`, `level`, `total_duration_hours`, `total_lessons_count`, `students_count`, `is_published`, `is_featured`) VALUES
(1, 3, 2, 'Lập trình Fullstack Web Developer Chuyên Nghiệp', 'fullstack-web-developer', 'Khóa học đào tạo Fullstack Web thực chiến, xây dựng dự án quy mô doanh nghiệp từ nền tảng đến production.', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80', 1299000.00, 2500000.00, 'all', 120, 68, 12450, TRUE, TRUE),
(2, 2, 3, 'Xây dựng RESTful API với Node.js, Express & MongoDB', 'restful-api-nodejs-mongodb', 'Nắm vững tư duy thiết kế API chuẩn mực, kiến trúc MVC, xác thực JWT và tối ưu truy vấn dữ liệu.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80', 899000.00, 1500000.00, 'intermediate', 45, 40, 8920, TRUE, TRUE),
(3, 1, 2, 'Lập trình JavaScript Nâng Cao (ES6+ & Asynchronous)', 'javascript-nang-cao', 'Làm chủ bất đồng bộ (Promise, Async/Await), Scope, Closure, Prototype và các tính năng ES6+ hiện đại.', 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&q=80', 699000.00, 1200000.00, 'intermediate', 35, 32, 18320, TRUE, FALSE),
(4, 1, 2, 'Xây dựng giao diện hiện đại với React.js & Tailwind CSS', 'reactjs-tailwind-css', 'Học React.js từ cơ bản đến nâng cao, làm chủ React Hooks, Context API và xây dựng UI thần tốc với Tailwind.', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80', 990000.00, 1800000.00, 'all', 55, 52, 14210, TRUE, TRUE),
(5, 4, 3, 'DevOps Nâng Cao: CI/CD & Triển khai hạ tầng AWS', 'devops-nang-cao-aws', 'Tự động hóa triển khai hạ tầng đám mây với Docker, GitHub Actions và dịch vụ Amazon Web Services.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80', 1499000.00, 2800000.00, 'advanced', 60, 48, 6200, TRUE, TRUE),
(6, 4, 3, 'Docker & Kubernetes Thực Chiến Cho Developers', 'docker-kubernetes-thuc-chien', 'Đóng gói ứng dụng, điều phối container hóa tự động và quản lý microservices trên production.', 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&q=80', 999000.00, 1800000.00, 'intermediate', 40, 36, 7800, TRUE, FALSE),
(7, 1, 2, 'HTML & CSS Cơ Bản Cho Người Mới Bắt Đầu', 'html-css-co-ban', 'Bắt đầu từ số 0, nắm vững thẻ HTML5, bố cục CSS Box Model, Flexbox và Grid.', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&q=80', 0.00, NULL, 'beginner', 30, 166, 185420, TRUE, FALSE),
(8, 1, 2, 'JavaScript Nền Tảng Cho Người Mới', 'javascript-co-ban', 'Cú pháp hiện đại ES6+, xử lý DOM, sự kiện và tư duy lập trình căn bản.', 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&q=80', 0.00, NULL, 'beginner', 40, 204, 142300, TRUE, FALSE),
(9, 1, 2, 'Responsive Web Design Đa Thiết Bị', 'responsive-web-design', 'Xây dựng giao diện tương thích hoàn hảo trên điện thoại, máy tính bảng và desktop.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80', 0.00, NULL, 'beginner', 15, 48, 67800, TRUE, FALSE),
(10, 3, 2, 'Git & GitHub Thực Chiến', 'git-github-thuc-chien', 'Quản lý mã nguồn phiên bản, phân nhánh branch, giải quyết conflict và làm việc nhóm hiệu quả.', 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&q=80', 0.00, NULL, 'beginner', 10, 32, 95600, TRUE, FALSE);

-- ------------------------------------------------------------------------------
-- 4. BẢNG LESSONS (12 bài học phân theo section_name)
-- ------------------------------------------------------------------------------
INSERT INTO `lessons` (`id`, `course_id`, `section_name`, `title`, `slug`, `video_url`, `duration_seconds`, `order_index`, `is_free_preview`) VALUES
(1, 1, 'Chương 1: Khởi động & Môi trường Fullstack', 'Bài 1: Giới thiệu kiến trúc tổng quan Fullstack Web', 'gioi-thieu-kien-truc-fullstack', 'https://www.youtube.com/watch?v=sample1', 720, 1, TRUE),
(2, 1, 'Chương 1: Khởi động & Môi trường Fullstack', 'Bài 2: Cài đặt Node.js, Express và kết nối Database', 'cai-dat-moi-truong', 'https://www.youtube.com/watch?v=sample2', 900, 2, TRUE),
(3, 1, 'Chương 2: Thiết kế Database & Backend Core', 'Bài 3: Thiết kế Schema chuẩn 3NF và Index tối ưu', 'thiet-ke-schema', 'https://www.youtube.com/watch?v=sample3', 1200, 3, FALSE),
(4, 1, 'Chương 3: Xác thực người dùng & Bảo mật', 'Bài 47: Tích hợp xác thực JWT & Cookie Refresh Token', 'xac-thuc-jwt-refresh-token', 'https://www.youtube.com/watch?v=sample4', 1450, 4, FALSE),
(5, 2, 'Chương 1: Kiến trúc RESTful & MVC', 'Bài 1: Nguyên tắc thiết kế RESTful API chuẩn chuẩn RFC', 'nguyen-tac-restful-api', 'https://www.youtube.com/watch?v=sample5', 850, 1, TRUE),
(6, 2, 'Chương 1: Kiến trúc RESTful & MVC', 'Bài 2: Tổ chức Controller, Router và Service Pattern', 'controller-service-pattern', 'https://www.youtube.com/watch?v=sample6', 1100, 2, TRUE),
(7, 2, 'Chương 2: Kết nối MongoDB & Mongoose ORM', 'Bài 15: Thiết kế schema với Mongoose & Quan hệ dữ liệu', 'mongoose-schema-relationship', 'https://www.youtube.com/watch?v=sample7', 1300, 3, FALSE),
(8, 3, 'Chương 1: ES6+ Tính Năng Cốt Lõi', 'Bài 1: Let, Const, Arrow function và Destructuring', 'es6-core-features', 'https://www.youtube.com/watch?v=sample8', 600, 1, TRUE),
(9, 3, 'Chương 2: Xử lý Bất đồng bộ chuyên sâu', 'Bài 12: Promise, Async/Await và Event Loop cơ chế', 'async-await-event-loop', 'https://www.youtube.com/watch?v=sample9', 1400, 2, FALSE),
(10, 7, 'Chương 1: Nhập môn HTML cơ bản', 'Bài 1: Cấu trúc một trang HTML5 chuẩn', 'cau-truc-html5', 'https://www.youtube.com/watch?v=sample10', 500, 1, TRUE),
(11, 7, 'Chương 2: Định dạng CSS căn bản', 'Bài 2: CSS Selector, Box Model và Spacing', 'css-box-model', 'https://www.youtube.com/watch?v=sample11', 820, 2, TRUE),
(12, 10, 'Chương 1: Bắt đầu với Git', 'Bài 1: Git init, add, commit và mô hình 3 trạng thái', 'git-co-ban', 'https://www.youtube.com/watch?v=sample12', 650, 1, TRUE);

-- ------------------------------------------------------------------------------
-- 5. BẢNG ROADMAPS (4 lộ trình nghề nghiệp chuẩn kèm JSON steps & skills)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 6. BẢNG ENROLLMENTS (Tiến độ học tập của Anh Tú & Phương Linh)
-- ------------------------------------------------------------------------------
INSERT INTO `enrollments` (`id`, `user_id`, `course_id`, `status`, `progress_percent`, `completed_lessons_count`, `current_lesson_title`, `certificate_code`) VALUES
(1, 1, 1, 'in_progress', 68.00, 46, 'Bài 47: Tích hợp xác thực JWT & Cookie Refresh Token', NULL),
(2, 1, 2, 'in_progress', 35.00, 14, 'Bài 15: Thiết kế schema với Mongoose & Quan hệ dữ liệu', NULL),
(3, 1, 3, 'completed', 100.00, 32, 'Đã hoàn thành toàn bộ khóa học', 'CERT-2026-F8902JS'),
(4, 1, 7, 'completed', 100.00, 166, 'Đã hoàn thành toàn bộ khóa học', 'CERT-2026-HTMLCSS01'),
(5, 5, 1, 'in_progress', 18.00, 12, 'Bài 12: Cấu trúc cơ bản ứng dụng Express', NULL);

-- ------------------------------------------------------------------------------
-- 7. BẢNG ORDERS (5 đơn hàng & giao dịch thanh toán)
-- ------------------------------------------------------------------------------
INSERT INTO `orders` (`id`, `order_code`, `transaction_code`, `user_id`, `course_id`, `amount`, `original_amount`, `payment_method`, `payment_content`, `status`, `created_at`) VALUES
(1, 'DH-84920', 'TXN-902814', 1, 1, 1299000.00, 2500000.00, 'VNPay QR', 'Thanh toán khóa học Fullstack Web Developer', 'completed', '2026-11-15 14:32:10'),
(2, 'DH-81203', 'TXN-831902', 1, 3, 699000.00, 1200000.00, 'Chuyển khoản (Vietcombank)', 'Thanh toán khóa học Javascript Nâng Cao', 'completed', '2026-10-02 09:15:44'),
(3, 'DH-79401', 'TXN-761298', 1, 2, 899000.00, 1500000.00, 'MoMo QR', 'Thanh toán khóa học RESTful API Node.js', 'completed', '2026-09-18 16:45:20'),
(4, 'DH-91044', 'TXN-948102', 1, 5, 1499000.00, 2800000.00, 'VNPay QR', 'Thanh toán khóa học DevOps Nâng Cao AWS', 'completed', '2026-11-01 11:20:05'),
(5, 'DH-92105', 'TXN-950211', 5, 1, 1299000.00, 2500000.00, 'Chuyển khoản (Vietcombank)', 'Thanh toán khóa học Fullstack Web Developer', 'completed', '2026-11-16 08:30:00');

-- ------------------------------------------------------------------------------
-- 8. BẢNG ARTICLES (5 bài viết bảng tin phủ đủ mọi category)
-- ------------------------------------------------------------------------------
INSERT INTO `articles` (`id`, `author_id`, `title`, `slug`, `summary`, `content`, `thumbnail_url`, `category`, `read_time_minutes`, `tags_json`, `views_count`, `likes_count`, `comments_count`) VALUES
(1, 2, 'Xây dựng kiến trúc Clean Architecture với Node.js & TypeScript', 'clean-architecture-nodejs-typescript', 'Phân tách rành mạch các lớp Controller, Service, Repository giúp mã nguồn dễ mở rộng, bảo trì và viết Unit Test hiệu quả trong dự án lớn.', '# 1. Giới thiệu Clean Architecture\nClean Architecture giúp tách biệt rõ ràng giữa logic nghiệp vụ và các dịch vụ bên ngoài...', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80', 'backend', 6, '["Node.js", "TypeScript", "Architecture"]', 3420, 184, 29),
(2, 1, 'Tối ưu hóa Performance trong React 18: useMemo, useCallback & useTransition', 'toi-uu-performance-react-18', 'Khi nào bạn thực sự cần tối ưu render? Phân tích các trường hợp lạm dụng memo hóa và cách sử dụng Concurrent Features để UI luôn mượt mà.', '# 1. Khi nào nên dùng useMemo?\nKhông phải mọi phép tính đều cần memoize. Việc sử dụng bừa bãi có thể phản tác dụng...', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80', 'frontend', 8, '["React.js", "Performance", "Hooks"]', 4850, 312, 45),
(3, 3, 'Hành trình từ Zero đến triển khai tự động với Docker & GitHub Actions', 'docker-github-actions-ci-cd', 'Hướng dẫn từng bước cấu hình CI/CD pipeline, tự động build Docker image, chạy test và deploy lên server VPS mỗi khi push code lên nhánh main.', '# 1. CI/CD là gì?\nContinuous Integration và Continuous Deployment giúp tự động hóa quy trình phân phối sản phẩm...', 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=400&q=80', 'devops', 10, '["Docker", "CI/CD", "GitHub Actions"]', 2910, 195, 18),
(4, 2, 'Kinh nghiệm vượt qua vòng phỏng vấn kỹ thuật Fullstack tại các công ty Tech', 'kinh-nghiem-phong-van-fullstack', 'Những câu hỏi kinh điển về Database indexing, Caching với Redis, xử lý bất đồng bộ và kỹ năng giải quyết bài toán System Design căn bản.', '# 1. Các chủ đề phỏng vấn cốt lõi\nNhà tuyển dụng thường tập trung vào tư duy thuật toán, thiết kế CSDL và cách debug...', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80', 'career', 7, '["Career", "Interview", "System Design"]', 6200, 420, 63),
(5, 3, '10 Mẹo Clean Code giúp mã nguồn của bạn chuyên nghiệp hơn ngay lập tức', '10-meo-clean-code-chuyen-nghiep', 'Quy tắc đặt tên biến có ý nghĩa, nguyên lý DRY (Don\'t Repeat Yourself), xử lý lỗi sớm bằng Guard Clauses và cách viết hàm đơn nhiệm.', '# 1. Nguyên lý Guard Clauses\nThay vì lồng nhau quá nhiều if-else, hãy return sớm ngay khi điều kiện không thỏa mãn...', 'https://images.unsplash.com/photo-1516116211227-bbc8c0576352?w=400&q=80', 'tips', 5, '["Clean Code", "Best Practices", "Refactor"]', 5100, 340, 38);

-- ------------------------------------------------------------------------------
-- 9. BẢNG ARTICLE_COMMENTS (Bình luận & phản hồi lồng nhau)
-- ------------------------------------------------------------------------------
INSERT INTO `article_comments` (`id`, `article_id`, `user_id`, `parent_id`, `content`) VALUES
(1, 1, 1, NULL, 'Bài viết rất chi tiết và thực tế, cảm ơn tác giả đã chia sẻ!'),
(2, 1, 2, 1, 'Cảm ơn Tú đã đọc và ủng hộ bài viết nhé! Hãy áp dụng vào dự án thực tế để cảm nhận sự linh hoạt.'),
(3, 1, 5, NULL, 'Cho mình hỏi về cách quản lý Dependency Injection trong Node.js khi áp dụng kiến trúc này?'),
(4, 1, 3, 3, 'Chào bạn, bạn có thể tham khảo thư viện Awilix hoặc InversifyJS rất tiện cho DI trong Node.js nhé.'),
(5, 2, 5, NULL, 'Bài viết về useTransition rất bổ ích, mình đã áp dụng cho ô search và UI phản hồi cực mượt!'),
(6, 4, 1, NULL, 'Rất đồng ý với tác giả về phần Database indexing, phỏng vấn các vị trí Senior hỏi rất kỹ phần này.');

-- ------------------------------------------------------------------------------
-- 10. BẢNG NOTIFICATIONS (Thông báo Chuông Header & Hoạt động Timeline)
-- ------------------------------------------------------------------------------
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `content`, `course_name`, `link_url`, `is_read`, `created_at`) VALUES
-- 4 bản ghi cho trang "Hoạt động" (type = 'activity')
(1, 1, 'activity', 'Hoàn thành bài tập: React Custom Hooks & Context API', 'Đã nộp bài tập và vượt qua các test cases tự động', 'Fullstack Web Developer', '/khoa-hoc-cua-toi', TRUE, NOW() - INTERVAL 2 HOUR),
(2, 1, 'activity', 'Đăng ký thành công khóa học Lập trình Javascript Nâng Cao', 'Kích hoạt quyền truy cập trọn đời vào toàn bộ bài giảng và bài tập', 'Javascript Advanced', '/khoa-hoc-cua-toi', TRUE, NOW() - INTERVAL 3 DAY),
(3, 1, 'activity', 'Nhận chứng chỉ hoàn thành khóa học Javascript', 'Chúc mừng bạn đã nhận chứng chỉ điện tử CERT-2026-F8902JS', 'Javascript Advanced', '/khoa-hoc-cua-toi', TRUE, NOW() - INTERVAL 7 DAY),
(4, 1, 'activity', 'Đạt điểm tuyệt đối 100/100 bài kiểm tra trắc nghiệm HTML5 & CSS3', 'Hoàn thành xuất sắc bài đánh giá định kỳ', 'HTML & CSS Cơ Bản', '/khoa-hoc-cua-toi', TRUE, NOW() - INTERVAL 14 DAY),

-- 4 bản ghi cho Popup "Chuông thông báo" Header (type = 'notification')
(5, 1, 'notification', 'Chào mừng bạn tham gia nền tảng học tập', 'Hãy bắt đầu lộ trình học tập đầu tiên của bạn ngay hôm nay để nhận ưu đãi học viên mới.', NULL, '/lo-trinh', FALSE, NOW() - INTERVAL 1 HOUR),
(6, 1, 'notification', 'Khóa học Fullstack Web Developer đã cập nhật bài giảng mới', 'Chương 3 vừa được bổ sung video hướng dẫn tối ưu bảo mật Refresh Token.', 'Fullstack Web Developer', '/khoa-hoc-cua-toi', FALSE, NOW() - INTERVAL 5 HOUR),
(7, 1, 'notification', 'Giảng viên Sơn Đặng đã trả lời bình luận của bạn', 'Câu hỏi trong bài viết Kiến trúc Clean Architecture đã có phản hồi mới.', NULL, '/bang-tin', TRUE, NOW() - INTERVAL 1 DAY),
(8, 1, 'notification', 'Kích hoạt thành công khóa học DevOps Nâng Cao AWS', 'Đơn hàng DH-91044 đã được hệ thống kích hoạt tự động.', 'DevOps Nâng Cao AWS', '/my-orders', TRUE, NOW() - INTERVAL 4 DAY);
