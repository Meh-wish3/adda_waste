const express = require('express');
const { getHouseholds } = require('../controllers/householdController');

const router = express.Router();

router.get('/', getHouseholds);

module.exports = router;

