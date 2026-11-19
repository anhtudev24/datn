import express from 'express';
import {
  login,
  register,
  getMe,
  updateProfile,
  changePassword,
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Công khai
router.post('/login', login);
router.post('/register', register);

// Cần đăng nhập (JWT)
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

export default router;
