const mongoose = require('mongoose');

const hotspotSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    temperature: {
      type: Number,
      required: [true, 'Temperature is required'],
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required for map visualization'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required for map visualization'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Hotspot', hotspotSchema);
