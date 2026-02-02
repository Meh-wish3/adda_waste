const express = require('express');
const { getCollectors } = require('../controllers/collectorController');

const router = express.Router();

router.get('/', getCollectors);

module.exports = router;

