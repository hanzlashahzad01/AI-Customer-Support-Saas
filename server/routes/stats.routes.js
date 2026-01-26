const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const auth = require('../middleware/auth.middleware');

router.get('/dashboard', auth(), statsController.getDashboardStats);

module.exports = router;
