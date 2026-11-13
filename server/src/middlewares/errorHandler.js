/**
 * Middleware xử lý route không tồn tại (404 Not Found)
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Không tìm thấy endpoint: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware xử lý lỗi toàn cục (Global Error Handler)
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Đã có lỗi xảy ra trên server!',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
