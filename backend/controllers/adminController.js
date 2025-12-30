import pool from '../config/database.js';

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(
      `SELECT userid, name, email, phone_no, gender, dob, address, role, created_at 
       FROM users ORDER BY created_at DESC`
    );

    res.status(200).json({
      success: true,
      count: users.rows.length,
      users: users.rows
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get user by ID (Admin only)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await pool.query(
      `SELECT userid, name, email, phone_no, gender, dob, address, role, created_at 
       FROM users WHERE userid = $1`,
      [id]
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
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update user role (Admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Allowed roles: user, admin'
      });
    }

    const updatedUser = await pool.query(
      `UPDATE users 
       SET role = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE userid = $2
       RETURNING userid, name, email, phone_no, role`,
      [role, id]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user: updatedUser.rows[0]
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const deletedUser = await pool.query(
      'DELETE FROM users WHERE userid = $1 RETURNING userid, email',
      [id]
    );

    if (deletedUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      deletedUser: deletedUser.rows[0]
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get dashboard stats (Admin only)
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await pool.query('SELECT COUNT(*) FROM users');
    const totalAdmins = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'admin'");
    const todayUsers = await pool.query(
      "SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURRENT_DATE"
    );

    res.status(200).json({
      success: true,
      stats: {
        totalUsers: parseInt(totalUsers.rows[0].count),
        totalAdmins: parseInt(totalAdmins.rows[0].count),
        todayUsers: parseInt(todayUsers.rows[0].count)
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};