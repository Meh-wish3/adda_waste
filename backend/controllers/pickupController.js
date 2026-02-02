const PickupRequest = require('../models/PickupRequest');
const { addIncentivePoints } = require('../services/incentiveService');

async function createPickupRequest(req, res, next) {
  try {
    const { householdId, wasteType, pickupTime, overflow, location } = req.body;

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
      location: location && location.lat && location.lng ? location : undefined,
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

    // Enrich with household area info for collector view
    if (status === 'pending' || !status) {
      const Household = require('../models/Household');
      const householdIds = [...new Set(pickups.map((p) => p.householdId))];
      const households = await Household.find({
        householdId: { $in: householdIds },
      }).lean();

      const householdMap = households.reduce((acc, h) => {
        acc[h.householdId] = h;
        return acc;
      }, {});

      const enriched = pickups.map((p) => ({
        ...p,
        area: householdMap[p.householdId]?.area || 'Unknown',
        householdLocation: householdMap[p.householdId]?.location || null,
      }));

      return res.json(enriched);
    }

    res.json(pickups);
  } catch (err) {
    next(err);
  }
}

async function verifySegregation(req, res, next) {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    const pickup = await PickupRequest.findById(id);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    pickup.segregationVerified = verified === true;
    await pickup.save();

    res.json({ pickup });
  } catch (err) {
    next(err);
  }
}

async function completePickup(req, res, next) {
  try {
    const { id } = req.params;

    const pickup = await PickupRequest.findById(id);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    pickup.status = 'completed';
    pickup.completedBy = req.user.userId;
    await pickup.save();

    // Award points only if segregation was verified
    let incentive = null;
    if (pickup.segregationVerified) {
      incentive = await addIncentivePoints(pickup.householdId, pickup.wasteType);
    }

    res.json({ pickup, incentive });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createPickupRequest,
  listPickupRequests,
  verifySegregation,
  completePickup,
};

