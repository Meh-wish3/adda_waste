const mongoose = require('mongoose');

const HouseholdSchema = new mongoose.Schema(
  {
    householdId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    headName: {
      type: String,
    },
    area: {
      type: String,
      required: true,
      index: true,
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    addressNote: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Household', HouseholdSchema);

