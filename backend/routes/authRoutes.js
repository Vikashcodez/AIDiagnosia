import express from 'express';
import { body } from 'express-validator';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/constants.js';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getSecurityQuestions,
  verifySecurityAnswers,
  resetPassword
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('phone_no').notEmpty().withMessage('Phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('address').optional()
];

const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Public routes
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);

// Forgot password routes
router.get('/security-questions', getSecurityQuestions);
router.post('/verify-security-answers', verifySecurityAnswers);
router.post('/reset-password', resetPassword);

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/login?error=google_auth_failed`,
    session: true
  }),
  (req, res) => {
    // Generate JWT token for the authenticated user
    const token = jwt.sign(
      { 
        userId: req.user.userid, 
        email: req.user.email, 
        role: req.user.role,
        name: req.user.name 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/auth/callback?token=${token}`);
  }
);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);

export default router;