const express = require('express');
const {
  getIncentiveForHousehold,
} = require('../controllers/incentiveController');

const router = express.Router();

router.get('/:householdId', getIncentiveForHousehold);

module.exports = router;

