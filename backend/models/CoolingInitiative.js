const mongoose = require('mongoose');

const coolingInitiativeSchema = new mongoose.Schema(
  {
    initiativeName: {
      type: String,
      required: [true, 'Initiative name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Tree Plantation', 'Cool Roof', 'Public Park', 'Water Mist Station'],
      required: [true, 'Type is required'],
    },
    status: {
      type: String,
      enum: ['Planned', 'Ongoing', 'Completed'],
      default: 'Planned',
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CoolingInitiative', coolingInitiativeSchema);
