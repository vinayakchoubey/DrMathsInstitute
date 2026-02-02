import express from 'express';
import { verifyPayment, createOrder, getAllPayments } from '../controllers/paymentController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/', protect, admin, getAllPayments);

export default router;
