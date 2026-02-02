const express = require('express');
const {
    getOverview,
    getWasteStats,
    getCollectorPerformance,
} = require('../controllers/adminController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// All admin routes require ADMIN role
router.use(authenticate);
router.use(requireRole('ADMIN'));

router.get('/overview', getOverview);
router.get('/waste-stats', getWasteStats);
router.get('/collector-performance', getCollectorPerformance);

module.exports = router;
