const express = require('express');
const {
  createPickupRequest,
  listPickupRequests,
  completePickup,
} = require('../controllers/pickupController');

const router = express.Router();

// Citizen: create new pickup request
router.post('/', createPickupRequest);

// Collector: list pickup requests (optionally filter by status/household)
router.get('/', listPickupRequests);

// Collector: mark pickup as completed and trigger incentives
router.patch('/:id/complete', completePickup);

module.exports = router;

