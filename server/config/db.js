
require('dotenv').config();
const { Pool } = require('pg');

// Database Configuration
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'predictifychurn',
  password: process.env.DB_PASSWORD || 'ARV12',
  port: process.env.DB_PORT || 5432,
};

// Create a new pool instance
const pool = new Pool(dbConfig);

// Test database connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

module.exports = pool;
