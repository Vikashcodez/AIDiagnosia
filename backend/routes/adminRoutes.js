import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getDashboardStats
} from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizeAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// All admin routes require both authentication and admin authorization
router.use(authenticateToken, authorizeAdmin);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/dashboard/stats', getDashboardStats);

export default router;