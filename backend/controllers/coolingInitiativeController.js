const { CoolingInitiative } = require('../models');

// @desc    Get all cooling initiatives
// @route   GET /api/cooling-initiatives
const getCoolingInitiatives = async (req, res) => {
  try {
    const initiatives = await CoolingInitiative.find();
    res.status(200).json({ success: true, count: initiatives.length, data: initiatives });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single cooling initiative
// @route   GET /api/cooling-initiatives/:id
const getCoolingInitiativeById = async (req, res) => {
  try {
    const initiative = await CoolingInitiative.findById(req.params.id);
    if (!initiative) {
      return res.status(404).json({ success: false, message: 'Cooling initiative not found' });
    }
    res.status(200).json({ success: true, data: initiative });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new cooling initiative
// @route   POST /api/cooling-initiatives
const createCoolingInitiative = async (req, res) => {
  try {
    const { initiativeName, location, type, status, startDate } = req.body;

    if (!initiativeName || !location || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide initiative name, location, and type',
      });
    }

    const initiative = await CoolingInitiative.create({
      initiativeName: initiativeName.trim(),
      location: location.trim(),
      type,
      status: status || 'Planned',
      startDate: startDate ? new Date(startDate) : new Date(),
    });

    res.status(201).json({ success: true, data: initiative });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update cooling initiative
// @route   PUT /api/cooling-initiatives/:id
const updateCoolingInitiative = async (req, res) => {
  try {
    const { initiativeName, location, type, status, startDate } = req.body;

    const updatePayload = {};
    if (initiativeName !== undefined) updatePayload.initiativeName = initiativeName.trim();
    if (location !== undefined) updatePayload.location = location.trim();
    if (type !== undefined) updatePayload.type = type;
    if (status !== undefined) updatePayload.status = status;
    if (startDate !== undefined) updatePayload.startDate = new Date(startDate);

    const initiative = await CoolingInitiative.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
    });
    if (!initiative) {
      return res.status(404).json({ success: false, message: 'Cooling initiative not found' });
    }

    res.status(200).json({ success: true, data: initiative });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete cooling initiative
// @route   DELETE /api/cooling-initiatives/:id
const deleteCoolingInitiative = async (req, res) => {
  try {
    const initiative = await CoolingInitiative.findByIdAndDelete(req.params.id);
    if (!initiative) {
      return res.status(404).json({ success: false, message: 'Cooling initiative not found' });
    }
    res.status(200).json({ success: true, message: 'Initiative deleted successfully', data: initiative });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCoolingInitiatives,
  getCoolingInitiativeById,
  createCoolingInitiative,
  updateCoolingInitiative,
  deleteCoolingInitiative,
};
