const express = require('express');
const {
  createPickupRequest,
  listPickupRequests,
  verifySegregation,
  completePickup,
} = require('../controllers/pickupController');

const router = express.Router();

// Citizen: create new pickup request
router.post('/', createPickupRequest);

// Collector: list pickup requests (optionally filter by status/household)
router.get('/', listPickupRequests);

// Collector: verify segregation (separate from completion)
router.patch('/:id/verify', verifySegregation);

// Collector: mark pickup as completed (points awarded only if verified)
router.patch('/:id/complete', completePickup);

module.exports = router;

