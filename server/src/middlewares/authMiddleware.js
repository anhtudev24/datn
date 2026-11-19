import jwt from 'jsonwebtoken';

/**
 * Middleware xác thực JWT token
 * Kiểm tra header Authorization: Bearer <token>
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Vui lòng đăng nhập để thực hiện chức năng này',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'datn_super_secret_jwt_key_2026_f8';
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // { id, email, username, role }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn',
    });
  }
};
