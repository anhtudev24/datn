import express from 'express';
import { getMyOrders, getMyPayments, createOrder } from '../controllers/orderController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getMyOrders);
router.get('/payments', authenticate, getMyPayments);
router.post('/', authenticate, createOrder);

export default router;
