const { Hotspot } = require('../models');

// @desc    Get all hotspots
// @route   GET /api/hotspots
const getHotspots = async (req, res) => {
  try {
    const hotspots = await Hotspot.find();
    res.status(200).json({ success: true, count: hotspots.length, data: hotspots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single hotspot
// @route   GET /api/hotspots/:id
const getHotspotById = async (req, res) => {
  try {
    const hotspot = await Hotspot.findById(req.params.id);
    if (!hotspot) {
      return res.status(404).json({ success: false, message: 'Hotspot not found' });
    }
    res.status(200).json({ success: true, data: hotspot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new hotspot
// @route   POST /api/hotspots
const createHotspot = async (req, res) => {
  try {
    const { location, temperature, severity, date, latitude, longitude } = req.body;

    if (!location || temperature === undefined || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide location, temperature, latitude, and longitude',
      });
    }

    const hotspot = await Hotspot.create({
      location: location.trim(),
      temperature: Number(temperature),
      severity: severity || 'Medium',
      date: date ? new Date(date) : new Date(),
      latitude: Number(latitude),
      longitude: Number(longitude),
    });

    res.status(201).json({ success: true, data: hotspot });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update hotspot
// @route   PUT /api/hotspots/:id
const updateHotspot = async (req, res) => {
  try {
    const { location, temperature, severity, date, latitude, longitude } = req.body;

    const updatePayload = {};
    if (location !== undefined) updatePayload.location = location.trim();
    if (temperature !== undefined) updatePayload.temperature = Number(temperature);
    if (severity !== undefined) updatePayload.severity = severity;
    if (date !== undefined) updatePayload.date = new Date(date);
    if (latitude !== undefined) updatePayload.latitude = Number(latitude);
    if (longitude !== undefined) updatePayload.longitude = Number(longitude);

    const hotspot = await Hotspot.findByIdAndUpdate(req.params.id, updatePayload, { new: true });
    if (!hotspot) {
      return res.status(404).json({ success: false, message: 'Hotspot not found' });
    }

    res.status(200).json({ success: true, data: hotspot });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete hotspot
// @route   DELETE /api/hotspots/:id
const deleteHotspot = async (req, res) => {
  try {
    const hotspot = await Hotspot.findByIdAndDelete(req.params.id);
    if (!hotspot) {
      return res.status(404).json({ success: false, message: 'Hotspot not found' });
    }
    res.status(200).json({ success: true, message: 'Hotspot deleted successfully', data: hotspot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getHotspots,
  getHotspotById,
  createHotspot,
  updateHotspot,
  deleteHotspot,
};
