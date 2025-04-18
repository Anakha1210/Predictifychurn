
const express = require('express');
const router = express.Router();
const { login, refreshToken } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Authentication routes
router.post('/login', login);
router.post('/refresh-token', authMiddleware, refreshToken);

module.exports = router;
