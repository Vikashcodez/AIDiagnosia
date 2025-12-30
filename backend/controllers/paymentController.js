import Razorpay from 'razorpay';
import crypto from 'crypto';
import pool from '../config/database.js';
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, PLANS } from '../config/constants.js';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user.userId;

    // Validate plan
    const selectedPlan = PLANS[plan.toUpperCase()];
    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected'
      });
    }

    // Check if user already has an active plan from transactions
    const activeSubscription = await pool.query(
      `SELECT * FROM transactions 
       WHERE user_id = $1 
         AND status = 'completed' 
         AND expiry_date > CURRENT_DATE`,
      [userId]
    );

    if (activeSubscription.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active subscription'
      });
    }

    // Create Razorpay order
    const options = {
      amount: selectedPlan.price * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: userId.toString(),
        plan: selectedPlan.name,
        duration: selectedPlan.duration
      }
    };

    const order = await razorpay.orders.create(options);

    // Save transaction to database
    await pool.query(
      `INSERT INTO transactions (
        user_id, 
        razorpay_order_id, 
        amount, 
        currency, 
        plan, 
        plan_duration,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        userId,
        order.id,
        selectedPlan.price,
        'INR',
        selectedPlan.name,
        selectedPlan.duration,
        'pending'
      ]
    );

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: RAZORPAY_KEY_ID
      },
      plan: selectedPlan
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
};

// Verify payment and update transaction
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user.userId;

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Get transaction details
    const transaction = await pool.query(
      `SELECT * FROM transactions 
       WHERE razorpay_order_id = $1 AND user_id = $2`,
      [razorpay_order_id, userId]
    );

    if (transaction.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    const { plan, plan_duration, amount } = transaction.rows[0];

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan_duration);

    // Update transaction status
    await pool.query(
      `UPDATE transactions 
       SET razorpay_payment_id = $1, 
           razorpay_signature = $2, 
           status = 'completed',
           expiry_date = $3,
           transaction_date = CURRENT_TIMESTAMP
       WHERE razorpay_order_id = $4`,
      [razorpay_payment_id, razorpay_signature, expiryDate, razorpay_order_id]
    );

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      transaction: {
        plan: plan,
        expiry_date: expiryDate,
        amount: amount
      }
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
};

// Get user's current plan from transactions
export const getUserPlan = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user's latest active subscription from transactions
    const activeSubscription = await pool.query(
      `SELECT plan, expiry_date FROM transactions 
       WHERE user_id = $1 
         AND status = 'completed' 
         AND expiry_date > CURRENT_DATE
       ORDER BY transaction_date DESC 
       LIMIT 1`,
      [userId]
    );

    // Get user's transaction history
    const transactions = await pool.query(
      `SELECT * FROM transactions 
       WHERE user_id = $1 AND status = 'completed'
       ORDER BY transaction_date DESC
       LIMIT 10`,
      [userId]
    );

    if (activeSubscription.rows.length > 0) {
      const { plan, expiry_date } = activeSubscription.rows[0];
      res.status(200).json({
        success: true,
        plan: {
          name: plan,
          expiry_date: expiry_date,
          is_active: true
        },
        transactions: transactions.rows
      });
    } else {
      res.status(200).json({
        success: true,
        plan: {
          name: 'free',
          expiry_date: null,
          is_active: false
        },
        transactions: transactions.rows
      });
    }

  } catch (error) {
    console.error('Get user plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user plan'
    });
  }
};

// Get all available plans
export const getPlans = async (req, res) => {
  try {
    const plans = Object.values(PLANS);
    
    res.status(200).json({
      success: true,
      plans: plans
    });

  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get plans'
    });
  }
};

// Get user transaction history
export const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const transactions = await pool.query(
      `SELECT * FROM transactions 
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const total = await pool.query(
      'SELECT COUNT(*) FROM transactions WHERE user_id = $1',
      [userId]
    );

    res.status(200).json({
      success: true,
      transactions: transactions.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total.rows[0].count),
        totalPages: Math.ceil(total.rows[0].count / limit)
      }
    });

  } catch (error) {
    console.error('Get transaction history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction history'
    });
  }
};

// Admin: Get all transactions
export const getAllTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, start_date, end_date } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT t.*, u.name as user_name, u.email 
      FROM transactions t
      JOIN users u ON t.user_id = u.userid
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND t.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (start_date) {
      query += ` AND DATE(t.created_at) >= $${paramCount}`;
      params.push(start_date);
      paramCount++;
    }

    if (end_date) {
      query += ` AND DATE(t.created_at) <= $${paramCount}`;
      params.push(end_date);
      paramCount++;
    }

    query += ` ORDER BY t.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const transactions = await pool.query(query, params);

    const totalQuery = `
      SELECT COUNT(*) 
      FROM transactions t
      JOIN users u ON t.user_id = u.userid
      WHERE 1=1
      ${status ? ' AND t.status = $1' : ''}
      ${start_date ? ' AND DATE(t.created_at) >= $2' : ''}
      ${end_date ? ' AND DATE(t.created_at) <= $3' : ''}
    `;

    const total = await pool.query(totalQuery, params.slice(0, paramCount - 1));

    res.status(200).json({
      success: true,
      transactions: transactions.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total.rows[0].count),
        totalPages: Math.ceil(total.rows[0].count / limit)
      }
    });

  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transactions'
    });
  }
};

// Admin: Get revenue statistics
export const getRevenueStats = async (req, res) => {
  try {
    // Daily revenue for last 30 days
    const dailyRevenue = await pool.query(`
      SELECT 
        DATE(transaction_date) as date,
        COUNT(*) as transactions,
        SUM(amount) as revenue
      FROM transactions 
      WHERE status = 'completed' 
        AND transaction_date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(transaction_date)
      ORDER BY date
    `);

    // Monthly revenue for last 12 months
    const monthlyRevenue = await pool.query(`
      SELECT 
        EXTRACT(YEAR FROM transaction_date) as year,
        EXTRACT(MONTH FROM transaction_date) as month,
        COUNT(*) as transactions,
        SUM(amount) as revenue
      FROM transactions 
      WHERE status = 'completed' 
        AND transaction_date >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY EXTRACT(YEAR FROM transaction_date), EXTRACT(MONTH FROM transaction_date)
      ORDER BY year, month
    `);

    // Plan-wise revenue
    const planRevenue = await pool.query(`
      SELECT 
        plan,
        COUNT(*) as transactions,
        SUM(amount) as revenue
      FROM transactions 
      WHERE status = 'completed'
      GROUP BY plan
      ORDER BY revenue DESC
    `);

    // Today's stats
    const todayStats = await pool.query(`
      SELECT 
        COUNT(*) as today_transactions,
        SUM(amount) as today_revenue
      FROM transactions 
      WHERE status = 'completed' 
        AND DATE(transaction_date) = CURRENT_DATE
    `);

    res.status(200).json({
      success: true,
      stats: {
        daily_revenue: dailyRevenue.rows,
        monthly_revenue: monthlyRevenue.rows,
        plan_revenue: planRevenue.rows,
        today: todayStats.rows[0]
      }
    });

  } catch (error) {
    console.error('Get revenue stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get revenue statistics'
    });
  }
};

// Cancel subscription (just mark as cancelled in transactions)
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get active subscription
    const activeSubscription = await pool.query(
      `SELECT transaction_id FROM transactions 
       WHERE user_id = $1 
         AND status = 'completed' 
         AND expiry_date > CURRENT_DATE
       ORDER BY transaction_date DESC 
       LIMIT 1`,
      [userId]
    );

    if (activeSubscription.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    // Mark transaction as cancelled
    await pool.query(
      `UPDATE transactions 
       SET status = 'cancelled'
       WHERE transaction_id = $1`,
      [activeSubscription.rows[0].transaction_id]
    );

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription'
    });
  }
};