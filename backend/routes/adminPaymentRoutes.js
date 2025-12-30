import express from 'express';
import {
  getAllTransactions,
  getRevenueStats
} from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizeAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// All admin payment routes require both authentication and admin authorization
router.use(authenticateToken, authorizeAdmin);

router.get('/transactions', getAllTransactions);
router.get('/revenue-stats', getRevenueStats);

export default router;