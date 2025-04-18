
const pool = require('../config/db');

// Health check endpoint
const healthCheck = (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
};

// Database test endpoint
const dbTest = async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      message: 'Database connection successful', 
      timestamp: result.rows[0].now 
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
};

module.exports = {
  healthCheck,
  dbTest
};
