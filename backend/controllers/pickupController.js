const PickupRequest = require('../models/PickupRequest');
const { addIncentivePoints } = require('../services/incentiveService');

async function createPickupRequest(req, res, next) {
  try {
    const { householdId, wasteType, pickupTime, overflow } = req.body;

    if (!householdId || !wasteType || !pickupTime) {
      return res
        .status(400)
        .json({ message: 'householdId, wasteType and pickupTime are required' });
    }

    const pickup = await PickupRequest.create({
      householdId,
      wasteType,
      pickupTime,
      overflow: !!overflow,
    });

    res.status(201).json(pickup);
  } catch (err) {
    next(err);
  }
}

async function listPickupRequests(req, res, next) {
  try {
    const { status, householdId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (householdId) filter.householdId = householdId;

    const pickups = await PickupRequest.find(filter)
      .sort({ pickupTime: 1 })
      .lean();
    res.json(pickups);
  } catch (err) {
    next(err);
  }
}

async function completePickup(req, res, next) {
  try {
    const { id } = req.params;
    const { correctSegregation, wasteTypeOverride } = req.body || {};

    const pickup = await PickupRequest.findById(id);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    pickup.status = 'completed';
    await pickup.save();

    let incentive = null;
    if (correctSegregation) {
      const wType = wasteTypeOverride || pickup.wasteType;
      incentive = await addIncentivePoints(pickup.householdId, wType);
    }

    res.json({ pickup, incentive });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createPickupRequest,
  listPickupRequests,
  completePickup,
};

