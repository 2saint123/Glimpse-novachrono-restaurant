const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/dashboard', authenticate, authorize(['admin']), analyticsController.getDashboardAnalytics);
router.get('/sales', authenticate, authorize(['admin']), analyticsController.getSalesAnalytics);
router.get('/logs', authenticate, authorize(['admin']), analyticsController.getActivityLogs);

module.exports = router;
