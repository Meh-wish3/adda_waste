const Incentive = require('../models/Incentive');

async function getIncentiveForHousehold(req, res, next) {
  try {
    const { householdId } = req.params;
    const incentive = await Incentive.findOne({ householdId });
    res.json(incentive || { householdId, points: 0 });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getIncentiveForHousehold,
};

