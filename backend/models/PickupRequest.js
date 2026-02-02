const mongoose = require('mongoose');

const PickupRequestSchema = new mongoose.Schema(
  {
    householdId: {
      type: String,
      required: true,
      index: true,
    },
    wasteType: {
      type: String,
      enum: ['wet', 'dry', 'e-waste'],
      required: true,
    },
    pickupTime: {
      type: Date,
      required: true,
    },
    overflow: {
      type: Boolean,
      default: false,
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'completed'],
      default: 'pending',
      index: true,
    },
    segregationVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PickupRequest', PickupRequestSchema);

