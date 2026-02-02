const Incentive = require('../models/Incentive');

// Simple points table per waste type
const POINTS_TABLE = {
  wet: 5,
  dry: 8,
  'e-waste': 15,
};

async function addIncentivePoints(householdId, wasteType) {
  const increment = POINTS_TABLE[wasteType] || 5;

  const incentive = await Incentive.findOneAndUpdate(
    { householdId },
    { $inc: { points: increment } },
    { new: true, upsert: true }
  );

  return incentive;
}

module.exports = {
  addIncentivePoints,
  POINTS_TABLE,
};

