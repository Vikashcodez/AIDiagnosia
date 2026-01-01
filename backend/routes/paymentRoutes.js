import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  verifyPayment,
  getUserPlan,
  getPlans,
  getTransactionHistory,
  cancelSubscription,
  getUserActiveSubscription
} from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/plans', getPlans);

// Protected routes (require authentication)
router.post('/create-order', authenticateToken, [
  body('plan').notEmpty().withMessage('Plan is required')
], createOrder);

router.post('/verify', authenticateToken, [
  body('razorpay_order_id').notEmpty().withMessage('Order ID is required'),
  body('razorpay_payment_id').notEmpty().withMessage('Payment ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Signature is required')
], verifyPayment);

router.get('/my-plan', authenticateToken, getUserPlan);
router.get('/transactions', authenticateToken, getTransactionHistory);
router.post('/cancel', authenticateToken, cancelSubscription);
router.get('/user/:userId', getUserActiveSubscription);

export default router;