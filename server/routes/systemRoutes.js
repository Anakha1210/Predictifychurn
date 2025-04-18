
const express = require('express');
const router = express.Router();
const { healthCheck, dbTest } = require('../controllers/systemController');

// System routes
router.get('/health', healthCheck);
router.get('/db-test', dbTest);

module.exports = router;
