const Collector = require('../models/Collector');

async function getCollectors(req, res, next) {
  try {
    const collectors = await Collector.find().sort({ name: 1 });
    res.json(collectors);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCollectors,
};

