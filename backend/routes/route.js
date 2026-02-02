const express = require('express');
const { generateRoute } = require('../controllers/routeController');

const router = express.Router();

// Collector: generate optimized route for current shift
router.get('/', generateRoute);

module.exports = router;

