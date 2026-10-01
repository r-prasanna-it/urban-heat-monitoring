const mongoose = require('mongoose');

const greenCoverSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    greenCoverPercentage: {
      type: Number,
      required: [true, 'Green cover percentage is required'],
      min: 0,
      max: 100,
    },
    numberOfTrees: {
      type: Number,
      required: [true, 'Number of trees is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['Good', 'Moderate', 'Low'],
      default: 'Moderate',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('GreenCover', greenCoverSchema);
