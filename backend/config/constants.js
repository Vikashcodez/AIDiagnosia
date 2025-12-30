// JWT Configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
export const JWT_EXPIRES_IN = '24h';

// Admin Configuration
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gmail.com';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Razorpay Configuration
export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'your_razorpay_key_id';
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret';

// User Roles
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// Subscription Plans
export const PLANS = {
  FREE: {
    name: 'free',
    price: 0,
    duration: 0, // days
    features: ['Basic features', 'Limited access']
  },
  BASIC: {
    name: 'basic',
    price: 299, // in INR
    duration: 30, // days
    features: ['All basic features', 'Priority support', 'Advanced analytics']
  },
  PREMIUM: {
    name: 'premium',
    price: 599, // in INR
    duration: 30, // days
    features: ['All basic features', '24/7 support', 'Advanced AI features', 'Unlimited usage']
  },
  ENTERPRISE: {
    name: 'enterprise',
    price: 1499, // in INR
    duration: 30, // days
    features: ['All premium features', 'Custom solutions', 'Dedicated account manager']
  }
};

// Validation Messages
export const VALIDATION = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN: 'Password must be at least 6 characters',
  NAME_REQUIRED: 'Name is required',
  PHONE_REQUIRED: 'Phone number is required',
  PHONE_INVALID: 'Please enter a valid phone number'
};