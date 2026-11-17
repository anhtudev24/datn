-- ==============================================================================
-- DATABASE SCHEMA CHO HỆ THỐNG HỌC LẬP TRÌNH TRỰC TUYẾN (DỰ ÁN ĐỒ ÁN TỐT NGHIỆP)
-- Thiết kế dựa trên 100% các chức năng thực tế của giao diện người dùng:
-- 1. Người dùng & Phân quyền (Users & Authentication)
-- 2. Khóa học, Chương học & Bài học (Courses, Sections, Lessons)
-- 3. Lộ trình nghề nghiệp (Roadmaps & Roadmap Steps)
-- 4. Tiến trình học tập & Chứng nhận (Enrollments, Progress, Certificates)
-- 5. Đơn hàng & Thanh toán (Orders, Order Items, Payments)
-- 6. Bảng tin, Bài viết & Tương tác (Articles, Tags, Comments, Likes)
-- 7. Thông báo & Nhật ký hoạt động (Notifications, User Activities)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `datn_learning_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `datn_learning_db`;

-- Tắt kiểm tra khóa ngoại tạm thời để khởi tạo lại sạch sẽ
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `user_activities`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `article_likes`;
DROP TABLE IF EXISTS `article_comments`;
DROP TABLE IF EXISTS `article_tag_relations`;
DROP TABLE IF EXISTS `article_tags`;
DROP TABLE IF EXISTS `articles`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `certificates`;
DROP TABLE IF EXISTS `lesson_progress`;
DROP TABLE IF EXISTS `enrollments`;
DROP TABLE IF EXISTS `roadmap_skills`;
DROP TABLE IF EXISTS `roadmap_courses`;
DROP TABLE IF EXISTS `roadmap_steps`;
DROP TABLE IF EXISTS `roadmaps`;
DROP TABLE IF EXISTS `lessons`;
DROP TABLE IF EXISTS `course_sections`;
DROP TABLE IF EXISTS `courses`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- 1. BẢNG NGƯỜI DÙNG (USERS)
-- Quản lý tài khoản, thông tin cá nhân, avatar, phân quyền
-- ==============================================================================
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT 'Họ và tên người dùng',
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Tên định danh @username',
  `email` VARCHAR(150) NOT NULL UNIQUE COMMENT 'Địa chỉ email đăng nhập',
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Mật khẩu mã hóa bcrypt',
  `phone` VARCHAR(20) NULL COMMENT 'Số điện thoại liên lạc',
  `avatar_url` VARCHAR(255) NULL COMMENT 'Đường dẫn ảnh đại diện',
  `bio` TEXT NULL COMMENT 'Giới thiệu bản thân',
  `role` ENUM('student', 'instructor', 'admin') DEFAULT 'student' COMMENT 'Vai trò hệ thống',
  `is_active` BOOLEAN DEFAULT TRUE COMMENT 'Trạng thái hoạt động tài khoản',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 2. BẢNG DANH MỤC KHÓA HỌC (CATEGORIES)
-- Ví dụ: Lập trình Web, Mobile App, Cơ sở dữ liệu, DevOps...
-- ==============================================================================
CREATE TABLE `categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT 'Tên danh mục',
  `slug` VARCHAR(120) NOT NULL UNIQUE COMMENT 'Đường dẫn tĩnh thân thiện SEO',
  `description` VARCHAR(255) NULL,
  `icon` VARCHAR(100) NULL COMMENT 'Tên icon hiển thị',
  `order_index` INT DEFAULT 0 COMMENT 'Thứ tự hiển thị',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 3. BẢNG KHÓA HỌC (COURSES)
-- Quản lý các khóa học hiển thị trên trang chủ và danh mục
-- ==============================================================================
CREATE TABLE `courses` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT UNSIGNED NULL,
  `instructor_id` BIGINT UNSIGNED NOT NULL COMMENT 'Người tạo / Giảng viên giảng dạy',
  `title` VARCHAR(200) NOT NULL COMMENT 'Tên khóa học',
  `slug` VARCHAR(220) NOT NULL UNIQUE,
  `description` TEXT NULL COMMENT 'Mô tả tóm tắt',
  `content` LONGTEXT NULL COMMENT 'Nội dung chi tiết khóa học',
  `thumbnail_url` VARCHAR(255) NULL COMMENT 'Ảnh đại diện khóa học',
  `price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'Giá bán (0 là miễn phí)',
  `original_price` DECIMAL(12, 2) NULL COMMENT 'Giá gốc trước khi giảm',
  `level` ENUM('beginner', 'intermediate', 'advanced', 'all') DEFAULT 'all' COMMENT 'Cấp độ học',
  `total_duration_hours` INT DEFAULT 0 COMMENT 'Ước lượng tổng số giờ học',
  `total_lessons_count` INT DEFAULT 0 COMMENT 'Tổng số bài học',
  `students_count` INT DEFAULT 0 COMMENT 'Tổng số học viên đã đăng ký',
  `is_published` BOOLEAN DEFAULT TRUE COMMENT 'Đã phát hành hay đang soạn thảo',
  `is_featured` BOOLEAN DEFAULT FALSE COMMENT 'Khóa học nổi bật trang chủ',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_courses_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_courses_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_courses_slug` (`slug`),
  INDEX `idx_courses_price` (`price`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 4. BẢNG CHƯƠNG HỌC (COURSE_SECTIONS)
-- Phân chia khóa học thành các chương mục (Module/Chương)
-- ==============================================================================
CREATE TABLE `course_sections` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `course_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(200) NOT NULL COMMENT 'Tên chương học',
  `order_index` INT DEFAULT 1 COMMENT 'Thứ tự chương trong khóa học',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_sections_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 5. BẢNG BÀI HỌC (LESSONS)
-- Từng bài học video, lý thuyết hoặc bài tập code
-- ==============================================================================
CREATE TABLE `lessons` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `section_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(200) NOT NULL COMMENT 'Tên bài học',
  `slug` VARCHAR(220) NOT NULL,
  `video_url` VARCHAR(255) NULL COMMENT 'Link video bài giảng',
  `content` LONGTEXT NULL COMMENT 'Nội dung văn bản, code mẫu',
  `duration_seconds` INT DEFAULT 0 COMMENT 'Thời lượng video tính bằng giây',
  `order_index` INT DEFAULT 1 COMMENT 'Thứ tự bài học trong chương',
  `is_free_preview` BOOLEAN DEFAULT FALSE COMMENT 'Cho phép học thử miễn phí',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_lessons_section` FOREIGN KEY (`section_id`) REFERENCES `course_sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 6. BẢNG LỘ TRÌNH NGHỀ NGHIỆP (ROADMAPS)
-- Hiển thị trên trang Lộ trình: Front-end, Back-end, Fullstack, DevOps...
-- ==============================================================================
CREATE TABLE `roadmaps` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL COMMENT 'Ví dụ: Lộ trình học Front-end',
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `tag_badge` VARCHAR(50) NOT NULL COMMENT 'Nhãn: Front-end Developer, DevOps...',
  `description` TEXT NOT NULL COMMENT 'Mô tả định hướng của lộ trình',
  `total_courses` INT DEFAULT 0,
  `total_hours` VARCHAR(50) DEFAULT '100+',
  `total_projects` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 7. BẢNG CÁC CHẶNG CỦA LỘ TRÌNH (ROADMAP_STEPS)
-- Từng chặng học tuần tự (Chặng 1, 2, 3, 4...)
-- ==============================================================================
CREATE TABLE `roadmap_steps` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `roadmap_id` INT UNSIGNED NOT NULL,
  `step_number` INT NOT NULL COMMENT 'Số thứ tự chặng (1, 2, 3...)',
  `title` VARCHAR(255) NOT NULL COMMENT 'Tên chặng học',
  `description` TEXT NULL,
  CONSTRAINT `fk_steps_roadmap` FOREIGN KEY (`roadmap_id`) REFERENCES `roadmaps` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 8. BẢNG KỸ NĂNG CỦA LỘ TRÌNH (ROADMAP_SKILLS)
-- Các tags kỹ năng: HTML5, CSS3, React.js, TypeScript, Docker...
-- ==============================================================================
CREATE TABLE `roadmap_skills` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `roadmap_id` INT UNSIGNED NOT NULL,
  `skill_name` VARCHAR(50) NOT NULL,
  CONSTRAINT `fk_skills_roadmap` FOREIGN KEY (`roadmap_id`) REFERENCES `roadmaps` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 9. BẢNG LIÊN KẾT KHÓA HỌC THUỘC LỘ TRÌNH (ROADMAP_COURSES)
-- ==============================================================================
CREATE TABLE `roadmap_courses` (
  `roadmap_id` INT UNSIGNED NOT NULL,
  `course_id` BIGINT UNSIGNED NOT NULL,
  `step_id` BIGINT UNSIGNED NULL,
  `order_index` INT DEFAULT 1,
  PRIMARY KEY (`roadmap_id`, `course_id`),
  CONSTRAINT `fk_rc_roadmap` FOREIGN KEY (`roadmap_id`) REFERENCES `roadmaps` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rc_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rc_step` FOREIGN KEY (`step_id`) REFERENCES `roadmap_steps` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 10. BẢNG ĐĂNG KÝ HỌC (ENROLLMENTS)
-- Quản lý các khóa học người dùng đang học (Trang "Khóa học của tôi")
-- ==============================================================================
CREATE TABLE `enrollments` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `course_id` BIGINT UNSIGNED NOT NULL,
  `status` ENUM('in_progress', 'completed', 'dropped') DEFAULT 'in_progress',
  `progress_percent` DECIMAL(5, 2) DEFAULT 0.00 COMMENT 'Phần trăm tiến độ (0.00% -> 100.00%)',
  `completed_lessons_count` INT DEFAULT 0,
  `last_lesson_id` BIGINT UNSIGNED NULL COMMENT 'Bài học đang học dở gần nhất',
  `enrolled_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `completed_at` DATETIME NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_course` (`user_id`, `course_id`),
  CONSTRAINT `fk_enrollments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_enrollments_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_enrollments_last_lesson` FOREIGN KEY (`last_lesson_id`) REFERENCES `lessons` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 11. BẢNG TIẾN ĐỘ TỪNG BÀI HỌC (LESSON_PROGRESS)
-- Đánh dấu học viên đã hoàn thành bài học nào
-- ==============================================================================
CREATE TABLE `lesson_progress` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `lesson_id` BIGINT UNSIGNED NOT NULL,
  `is_completed` BOOLEAN DEFAULT TRUE,
  `completed_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_lesson` (`user_id`, `lesson_id`),
  CONSTRAINT `fk_lp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_lp_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 12. BẢNG CHỨNG NHẬN HOÀN THÀNH (CERTIFICATES)
-- Cấp khi học viên đạt 100% tiến độ khóa học
-- ==============================================================================
CREATE TABLE `certificates` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `certificate_code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã chứng chỉ duy nhất, ví dụ: CERT-2026-F8902',
  `user_id` BIGINT UNSIGNED NOT NULL,
  `course_id` BIGINT UNSIGNED NOT NULL,
  `issued_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `certificate_url` VARCHAR(255) NULL COMMENT 'File PDF hoặc ảnh chứng chỉ',
  CONSTRAINT `fk_cert_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cert_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 13. BẢNG ĐƠN HÀNG (ORDERS)
-- Quản lý đơn hàng mua khóa học (Trang "Đơn hàng của tôi")
-- ==============================================================================
CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã đơn hàng hiển thị: DH-84920, DH-81203...',
  `user_id` BIGINT UNSIGNED NOT NULL,
  `total_amount` DECIMAL(12, 2) NOT NULL COMMENT 'Tổng số tiền',
  `discount_amount` DECIMAL(12, 2) DEFAULT 0.00 COMMENT 'Số tiền giảm giá nếu có',
  `final_amount` DECIMAL(12, 2) NOT NULL COMMENT 'Số tiền thực tế thanh toán',
  `payment_method` VARCHAR(50) NOT NULL COMMENT 'VNPay QR, Chuyển khoản, MoMo...',
  `status` ENUM('pending', 'completed', 'cancelled', 'refunded') DEFAULT 'completed',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_orders_code` (`order_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 14. BẢNG CHI TIẾT ĐƠN HÀNG (ORDER_ITEMS)
-- Các khóa học được mua trong một đơn hàng
-- ==============================================================================
CREATE TABLE `order_items` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `course_id` BIGINT UNSIGNED NOT NULL,
  `price` DECIMAL(12, 2) NOT NULL COMMENT 'Đơn giá lúc mua',
  CONSTRAINT `fk_oi_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_oi_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 15. BẢNG LỊCH SỬ THANH TOÁN (PAYMENTS)
-- Quản lý chi tiết từng giao dịch (Trang "Lịch sử thanh toán")
-- ==============================================================================
CREATE TABLE `payments` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `transaction_code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã giao dịch ngân hàng / gateway: TXN-902814...',
  `order_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `payment_gateway` VARCHAR(50) NOT NULL COMMENT 'VNPay QR, Vietcombank, MoMo...',
  `payment_content` VARCHAR(255) NOT NULL COMMENT 'Nội dung thanh toán',
  `status` ENUM('success', 'failed', 'pending') DEFAULT 'success',
  `transaction_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_payments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_payments_txn` (`transaction_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 16. BẢNG BÀI VIẾT BẢNG TIN (ARTICLES)
-- Quản lý bài viết chia sẻ trên trang "Bảng tin cộng đồng"
-- ==============================================================================
CREATE TABLE `articles` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `author_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL COMMENT 'Tiêu đề bài viết',
  `slug` VARCHAR(280) NOT NULL UNIQUE,
  `summary` TEXT NOT NULL COMMENT 'Mô tả tóm tắt ngắn',
  `content` LONGTEXT NOT NULL COMMENT 'Nội dung chi tiết định dạng Markdown / HTML',
  `thumbnail_url` VARCHAR(255) NULL,
  `category` ENUM('frontend', 'backend', 'devops', 'career', 'tips') NOT NULL DEFAULT 'frontend',
  `read_time_minutes` INT DEFAULT 5 COMMENT 'Thời gian ước tính đọc',
  `views_count` INT DEFAULT 0,
  `likes_count` INT DEFAULT 0,
  `comments_count` INT DEFAULT 0,
  `is_published` BOOLEAN DEFAULT TRUE,
  `published_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_articles_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_articles_category` (`category`),
  INDEX `idx_articles_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 17. BẢNG THẺ BÀI VIẾT (ARTICLE_TAGS)
-- Tags: #React.js, #Node.js, #Docker, #TypeScript...
-- ==============================================================================
CREATE TABLE `article_tags` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `slug` VARCHAR(60) NOT NULL UNIQUE,
  `articles_count` INT DEFAULT 0 COMMENT 'Số bài viết gắn thẻ này'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 18. BẢNG LIÊN KẾT BÀI VIẾT VÀ THẺ (ARTICLE_TAG_RELATIONS)
-- ==============================================================================
CREATE TABLE `article_tag_relations` (
  `article_id` BIGINT UNSIGNED NOT NULL,
  `tag_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`article_id`, `tag_id`),
  CONSTRAINT `fk_atr_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_atr_tag` FOREIGN KEY (`tag_id`) REFERENCES `article_tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 19. BẢNG BÌNH LUẬN BÀI VIẾT (ARTICLE_COMMENTS)
-- ==============================================================================
CREATE TABLE `article_comments` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `article_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `parent_id` BIGINT UNSIGNED NULL COMMENT 'Hỗ trợ reply bình luận lồng nhau',
  `content` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_comments_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comments_parent` FOREIGN KEY (`parent_id`) REFERENCES `article_comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 20. BẢNG LƯỢT THÍCH BÀI VIẾT (ARTICLE_LIKES)
-- ==============================================================================
CREATE TABLE `article_likes` (
  `article_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`article_id`, `user_id`),
  CONSTRAINT `fk_likes_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_likes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 21. BẢNG THÔNG BÁO (NOTIFICATIONS)
-- Dữ liệu cho popover Chuông thông báo trên Header
-- ==============================================================================
CREATE TABLE `notifications` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(200) NOT NULL COMMENT 'Tiêu đề thông báo',
  `content` TEXT NULL COMMENT 'Nội dung chi tiết',
  `type` ENUM('system', 'course', 'order', 'community') DEFAULT 'system',
  `link_url` VARCHAR(255) NULL COMMENT 'Đường dẫn chuyển đến khi click',
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_notif_user_read` (`user_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 22. BẢNG NHẬT KÝ HOẠT ĐỘNG (USER_ACTIVITIES)
-- Hiển thị trên trang "Hoạt động" (ActivitiesPage)
-- ==============================================================================
CREATE TABLE `user_activities` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `activity_type` ENUM('lesson_complete', 'course_enroll', 'comment', 'certificate_received') NOT NULL,
  `title` VARCHAR(255) NOT NULL COMMENT 'Ví dụ: Hoàn thành bài tập: React Custom Hooks',
  `course_name` VARCHAR(150) NULL COMMENT 'Thuộc khóa học / chuyên mục nào',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_activities_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================================================
-- DỮ LIỆU KHỞI TẠO MẪU (SEED DATA)
-- Khớp 100% với toàn bộ dữ liệu đang hiển thị trên giao diện của ứng dụng
-- ==============================================================================

-- 1. Người dùng mẫu
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `bio`, `role`) VALUES
(1, 'Anh Tú', 'tuanhifmzc', 'anhtu@example.com', '$2b$10$wT8K89gq1pB1Z5eYpZ7O3.7lFwK5dFvM0/fGfE08K2lWwR3yI8mS2', '0987654321', 'Học viên đam mê lập trình Fullstack Web', 'student'),
(2, 'Sơn Đặng', 'sondang', 'sondang@f8.edu.vn', '$2b$10$wT8K89gq1pB1Z5eYpZ7O3.7lFwK5dFvM0/fGfE08K2lWwR3yI8mS2', '0912345678', 'Founder & Giảng viên tại Học Lập Trình Để Đi Làm', 'instructor'),
(3, 'Minh Quân', 'minhquan', 'minhquan@example.com', '$2b$10$wT8K89gq1pB1Z5eYpZ7O3.7lFwK5dFvM0/fGfE08K2lWwR3yI8mS2', '0933221100', 'Senior Backend Engineer & Technical Mentor', 'instructor');

-- 2. Danh mục khóa học
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

-- 4. Chương học & Bài học mẫu cho khóa 1
INSERT INTO `course_sections` (`id`, `course_id`, `title`, `order_index`) VALUES
(1, 1, 'Chương 1: Khởi động & Cài đặt môi trường Fullstack', 1),
(2, 1, 'Chương 2: Thiết kế Database & Xây dựng Backend Core', 2),
(3, 1, 'Chương 3: Xác thực người dùng & Bảo mật hệ thống', 3);

INSERT INTO `lessons` (`id`, `section_id`, `title`, `slug`, `duration_seconds`, `order_index`, `is_free_preview`) VALUES
(1, 1, 'Bài 1: Giới thiệu tổng quan kiến trúc Fullstack', 'gioi-thieu-kien-truc-fullstack', 720, 1, TRUE),
(2, 1, 'Bài 2: Cài đặt Node.js, Express và kết nối Database', 'cai-dat-moi-truong', 900, 2, TRUE),
(3, 2, 'Bài 3: Thiết kế Schema chuẩn 3NF và tối ưu Index', 'thiet-ke-schema', 1200, 1, FALSE),
(4, 3, 'Bài 47: Tích hợp xác thực JWT & Cookie Refresh Token', 'xac-thuc-jwt-refresh-token', 1450, 1, FALSE);

-- 5. Lộ trình nghề nghiệp mẫu (Trang Lộ trình)
INSERT INTO `roadmaps` (`id`, `title`, `slug`, `tag_badge`, `description`, `total_courses`, `total_hours`, `total_projects`) VALUES
(1, 'Lộ trình học Front-end', 'lo-trinh-front-end', 'Front-end Developer', 'Lập trình viên Front-end là người xây dựng toàn bộ giao diện website và ứng dụng web trực quan, tương tác trực tiếp với người dùng cuối.', 8, '120+', 4),
(2, 'Lộ trình học Back-end', 'lo-trinh-back-end', 'Back-end Developer', 'Lập trình viên Back-end chịu trách nhiệm xử lý logic nghiệp vụ, thiết kế cơ sở dữ liệu, xây dựng RESTful/GraphQL API và vận hành hệ thống máy chủ.', 10, '150+', 5),
(3, 'Lộ trình học Fullstack Web', 'lo-trinh-fullstack', 'Fullstack Developer', 'Làm chủ toàn diện cả giao diện Front-end và hệ thống Back-end. Tự tay thiết kế, xây dựng và đưa sản phẩm thực tế lên môi trường Internet.', 14, '220+', 6),
(4, 'Lộ trình học DevOps', 'lo-trinh-devops', 'DevOps & Cloud Engineer', 'Tự động hóa quy trình phát hành phần mềm, quản lý hạ tầng đám mây dạng mã (IaC), giám sát hệ thống và đảm bảo độ sẵn sàng cao.', 7, '110+', 4);

-- 6. Các chặng của lộ trình Front-end
INSERT INTO `roadmap_steps` (`id`, `roadmap_id`, `step_number`, `title`, `description`) VALUES
(1, 1, 1, 'Nền tảng: HTML5, CSS3 & Responsive Design', 'Học cách dựng khung và tạo giao diện tương thích mọi kích thước màn hình.'),
(2, 1, 2, 'Lập trình JavaScript cơ bản đến ES6+ hiện đại', 'Nắm vững tư duy thuật toán, DOM manipulation và bất đồng bộ.'),
(3, 1, 3, 'Xây dựng UI với React.js, Vite & Tailwind CSS', 'Tổ chức Component, Hooks và xây dựng ứng dụng Single Page App.'),
(4, 1, 4, 'Quản lý state nâng cao & Tối ưu hiệu năng', 'Sử dụng Redux Toolkit, Zustand, caching dữ liệu và chuẩn SEO.');

-- 7. Kỹ năng của lộ trình Front-end
INSERT INTO `roadmap_skills` (`roadmap_id`, `skill_name`) VALUES
(1, 'HTML5'), (1, 'CSS3'), (1, 'JavaScript'), (1, 'React.js'), (1, 'Next.js'), (1, 'Tailwind CSS'), (1, 'TypeScript'), (1, 'Git/GitHub');

-- 8. Đăng ký học mẫu của học viên Anh Tú (User 1)
INSERT INTO `enrollments` (`id`, `user_id`, `course_id`, `status`, `progress_percent`, `completed_lessons_count`, `last_lesson_id`) VALUES
(1, 1, 1, 'in_progress', 68.00, 46, 4),
(2, 1, 2, 'in_progress', 35.00, 14, 2),
(3, 1, 3, 'completed', 100.00, 32, 3);

-- 9. Đơn hàng mẫu (Trang "Đơn hàng của tôi")
INSERT INTO `orders` (`id`, `order_code`, `user_id`, `total_amount`, `discount_amount`, `final_amount`, `payment_method`, `status`) VALUES
(1, 'DH-84920', 1, 2500000.00, 1201000.00, 1299000.00, 'VNPay QR', 'completed'),
(2, 'DH-81203', 1, 1200000.00, 501000.00, 699000.00, 'Chuyển khoản (Vietcombank)', 'completed');

INSERT INTO `order_items` (`id`, `order_id`, `course_id`, `price`) VALUES
(1, 1, 1, 1299000.00),
(2, 2, 3, 699000.00);

-- 10. Lịch sử thanh toán mẫu (Trang "Lịch sử thanh toán")
INSERT INTO `payments` (`id`, `transaction_code`, `order_id`, `user_id`, `amount`, `payment_gateway`, `payment_content`, `status`, `transaction_date`) VALUES
(1, 'TXN-902814', 1, 1, 1299000.00, 'VNPay QR', 'Thanh toán khóa học Fullstack Web Developer', 'success', '2026-11-15 14:32:10'),
(2, 'TXN-831902', 2, 1, 699000.00, 'Chuyển khoản (Vietcombank)', 'Thanh toán khóa học Javascript Nâng Cao', 'success', '2026-10-02 09:15:44');

-- 11. Bài viết mẫu trên Bảng tin
INSERT INTO `articles` (`id`, `author_id`, `title`, `slug`, `summary`, `content`, `thumbnail_url`, `category`, `read_time_minutes`, `views_count`, `likes_count`, `comments_count`) VALUES
(1, 2, 'Xây dựng kiến trúc Clean Architecture với Node.js & TypeScript', 'clean-architecture-nodejs-typescript', 'Phân tách rành mạch các lớp Controller, Service, Repository giúp mã nguồn dễ mở rộng, bảo trì và viết Unit Test hiệu quả trong dự án lớn.', '# Nội dung chi tiết bài viết...', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80', 'backend', 6, 3420, 184, 29),
(2, 1, 'Tối ưu hóa Performance trong React 18: useMemo, useCallback & useTransition', 'toi-uu-performance-react-18', 'Khi nào bạn thực sự cần tối ưu render? Phân tích các trường hợp lạm dụng memo hóa và cách sử dụng Concurrent Features để UI luôn mượt mà.', '# Nội dung chi tiết bài viết...', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80', 'frontend', 8, 4850, 312, 45);

-- 12. Thẻ bài viết
INSERT INTO `article_tags` (`id`, `name`, `slug`, `articles_count`) VALUES
(1, 'React.js', 'reactjs', 142),
(2, 'Node.js', 'nodejs', 98),
(3, 'TypeScript', 'typescript', 87),
(4, 'Docker', 'docker', 64),
(5, 'Clean Code', 'clean-code', 52);

INSERT INTO `article_tag_relations` (`article_id`, `tag_id`) VALUES
(1, 2), (1, 3), (1, 5),
(2, 1), (2, 3);

-- 13. Nhật ký hoạt động mẫu (Trang "Hoạt động")
INSERT INTO `user_activities` (`id`, `user_id`, `activity_type`, `title`, `course_name`, `created_at`) VALUES
(1, 1, 'lesson_complete', 'Hoàn thành bài tập: React Custom Hooks & Context API', 'Fullstack Web Developer', NOW() - INTERVAL 2 HOUR),
(2, 1, 'course_enroll', 'Đăng ký thành công khóa học Lập trình Javascript Nâng Cao', 'Javascript Advanced', NOW() - INTERVAL 3 DAY),
(3, 1, 'certificate_received', 'Đã hoàn thành chương: Cấu trúc dữ liệu & Thuật toán cơ bản', 'Khoa học máy tính', NOW() - INTERVAL 7 DAY);
