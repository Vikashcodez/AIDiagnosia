// JWT Configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
export const JWT_EXPIRES_IN = '24h';

// Admin Configuration
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gmail.com';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// User Roles
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
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