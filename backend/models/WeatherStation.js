const mongoose = require('mongoose');

const weatherStationSchema = new mongoose.Schema(
  {
    stationName: {
      type: String,
      required: [true, 'Station name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    temperature: {
      type: Number,
      required: [true, 'Temperature is required'],
    },
    humidity: {
      type: Number,
      required: [true, 'Humidity is required'],
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WeatherStation', weatherStationSchema);
