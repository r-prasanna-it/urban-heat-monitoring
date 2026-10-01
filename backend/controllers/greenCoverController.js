const { GreenCover } = require('../models');

// @desc    Get all green cover records
// @route   GET /api/green-cover
const getGreenCovers = async (req, res) => {
  try {
    const records = await GreenCover.find();
    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single green cover record
// @route   GET /api/green-cover/:id
const getGreenCoverById = async (req, res) => {
  try {
    const record = await GreenCover.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Green cover record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new green cover record
// @route   POST /api/green-cover
const createGreenCover = async (req, res) => {
  try {
    const { location, greenCoverPercentage, numberOfTrees, status } = req.body;

    if (!location || greenCoverPercentage === undefined || numberOfTrees === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide location, green cover percentage, and number of trees',
      });
    }

    const record = await GreenCover.create({
      location: location.trim(),
      greenCoverPercentage: Number(greenCoverPercentage),
      numberOfTrees: Number(numberOfTrees),
      status: status || 'Moderate',
    });

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update green cover record
// @route   PUT /api/green-cover/:id
const updateGreenCover = async (req, res) => {
  try {
    const { location, greenCoverPercentage, numberOfTrees, status } = req.body;

    const updatePayload = {};
    if (location !== undefined) updatePayload.location = location.trim();
    if (greenCoverPercentage !== undefined)
      updatePayload.greenCoverPercentage = Number(greenCoverPercentage);
    if (numberOfTrees !== undefined) updatePayload.numberOfTrees = Number(numberOfTrees);
    if (status !== undefined) updatePayload.status = status;

    const record = await GreenCover.findByIdAndUpdate(req.params.id, updatePayload, { new: true });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Green cover record not found' });
    }

    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete green cover record
// @route   DELETE /api/green-cover/:id
const deleteGreenCover = async (req, res) => {
  try {
    const record = await GreenCover.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Green cover record not found' });
    }
    res.status(200).json({ success: true, message: 'Record deleted successfully', data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getGreenCovers,
  getGreenCoverById,
  createGreenCover,
  updateGreenCover,
  deleteGreenCover,
};
