import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN, VALIDATION } from '../config/constants.js';

// User Registration
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone_no, password, gender, dob, address } = req.body;

    // Check if user already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR phone_no = $2',
      [email, phone_no]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or phone number'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const newUser = await pool.query(
      `INSERT INTO users (name, email, phone_no, password, gender, dob, address) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING userid, name, email, phone_no, gender, dob, address, role, created_at`,
      [name, email, phone_no, hashedPassword, gender, dob, address]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.rows[0].userid, email: newUser.rows[0].email, role: newUser.rows[0].role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser.rows[0],
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// User Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.rows[0].userid, 
        email: user.rows[0].email, 
        role: user.rows[0].role,
        name: user.rows[0].name 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.rows[0];

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await pool.query(
      `SELECT userid, name, email, phone_no, gender, dob, address, role, created_at 
       FROM users WHERE userid = $1`,
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: user.rows[0]
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, phone_no, gender, dob, address } = req.body;

    // Check if phone number is already taken by another user
    if (phone_no) {
      const phoneCheck = await pool.query(
        'SELECT * FROM users WHERE phone_no = $1 AND userid != $2',
        [phone_no, userId]
      );
      
      if (phoneCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Phone number already in use by another user'
        });
      }
    }

    const updatedUser = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           phone_no = COALESCE($2, phone_no), 
           gender = COALESCE($3, gender), 
           dob = COALESCE($4, dob), 
           address = COALESCE($5, address),
           updated_at = CURRENT_TIMESTAMP
       WHERE userid = $6
       RETURNING userid, name, email, phone_no, gender, dob, address, role, created_at, updated_at`,
      [name, phone_no, gender, dob, address, userId]
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser.rows[0]
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};