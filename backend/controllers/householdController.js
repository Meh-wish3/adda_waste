const Household = require('../models/Household');

async function getHouseholds(req, res, next) {
  try {
    const households = await Household.find().sort({ householdId: 1 });
    res.json(households);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getHouseholds,
};

