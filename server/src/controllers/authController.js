/**
 * Controller mẫu cho Authentication
 */

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp email và mật khẩu!',
      });
    }

    // TODO: Kiểm tra thông tin đăng nhập từ cơ sở dữ liệu
    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công (Dữ liệu mẫu)',
      data: {
        user: { id: 1, name: 'Nguyễn Văn A', email },
        token: 'sample_jwt_token_here',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin!',
      });
    }

    // TODO: Tạo tài khoản mới trong cơ sở dữ liệu
    return res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công (Dữ liệu mẫu)',
      data: {
        user: { id: 2, name, email },
      },
    });
  } catch (error) {
    next(error);
  }
};
