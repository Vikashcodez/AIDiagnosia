import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

const { Pool } = pg;
dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'auth_system',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const initializeDatabase = async () => {
  try {
    // Create users table WITHOUT plan_expiry
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        userid SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone_no VARCHAR(20) UNIQUE NOT NULL,
        gender VARCHAR(10),
        dob DATE,
        password VARCHAR(255) NOT NULL,
        address TEXT,
        role VARCHAR(20) DEFAULT 'user',
        question1 VARCHAR(255),
        question1_ans VARCHAR(255),
        question2 VARCHAR(255),
        question2_ans VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created/verified');

    // Add security question columns if they don't exist (for existing tables)
    try {
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS question1 VARCHAR(255),
        ADD COLUMN IF NOT EXISTS question1_ans VARCHAR(255),
        ADD COLUMN IF NOT EXISTS question2 VARCHAR(255),
        ADD COLUMN IF NOT EXISTS question2_ans VARCHAR(255)
      `);
      console.log('Security question columns added/verified');
    } catch (err) {
      console.log('Security columns may already exist:', err.message);
    }

    // Create transactions table WITH expiry_date
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        transaction_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(userid) ON DELETE CASCADE,
        razorpay_order_id VARCHAR(100) UNIQUE,
        razorpay_payment_id VARCHAR(100) UNIQUE,
        razorpay_signature VARCHAR(255),
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'INR',
        status VARCHAR(50) DEFAULT 'pending',
        plan VARCHAR(50) NOT NULL,
        plan_duration INTEGER NOT NULL, -- in days
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expiry_date DATE, -- Expiry date for this transaction
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Transactions table created/verified');

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_expiry ON transactions(expiry_date);
    `);

    console.log('Database indexes created/verified');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    const checkAdmin = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [adminEmail]
    );

    if (checkAdmin.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      await pool.query(
        `INSERT INTO users (name, email, phone_no, password, role) 
         VALUES ($1, $2, $3, $4, $5)`,
        ['Admin', adminEmail, '0000000000', hashedPassword, 'admin']
      );
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connected successfully:', result.rows[0].now);
    await initializeDatabase();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

testConnection();

export default pool;