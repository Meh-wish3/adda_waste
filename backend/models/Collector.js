const mongoose = require('mongoose');

const CollectorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    assignedWard: {
      type: String,
      required: true,
      default: 'Ward 4 - Guwahati',
    },
    shift: {
      type: String,
      enum: ['morning', 'evening'],
      default: 'morning',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Collector', CollectorSchema);

