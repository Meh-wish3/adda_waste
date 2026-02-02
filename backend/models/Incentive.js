const mongoose = require('mongoose');

const IncentiveSchema = new mongoose.Schema(
  {
    householdId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    points: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Incentive', IncentiveSchema);

