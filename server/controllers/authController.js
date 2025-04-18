
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Validate if email and password are provided
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email using PostgreSQL query
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('Database query result:', { userFound: !!result.rows[0], rowCount: result.rowCount });
    const user = result.rows[0];

    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password exists in database
    const passwordField = user.password || user.password_hash;
    if (!passwordField) {
      console.log('Login failed: No password hash found in database');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, passwordField);
    console.log('Password comparison result:', isMatch);
    
    if (!isMatch) {
      console.log('Login failed: Password mismatch');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    console.log('Login successful for user:', { id: user.id, email: user.email });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add refresh token function if needed
const refreshToken = async (req, res) => {
  try {
    // Get the user from the request (added by authMiddleware)
    const user = req.user;
    
    if (!user || !user.id) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated'
      });
    }
    
    // Generate a new token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      status: 'success',
      token
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to refresh token'
    });
  }
};

module.exports = {
  login,
  refreshToken
};
