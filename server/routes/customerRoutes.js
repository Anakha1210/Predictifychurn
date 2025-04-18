
const express = require('express');
const router = express.Router();
const { getCustomerData } = require('../controllers/customerController');

// Routes for customer data
router.get('/', getCustomerData);

module.exports = router;
