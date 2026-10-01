const { WeatherStation } = require('../models');

// @desc    Get all weather stations
// @route   GET /api/weather-stations
const getWeatherStations = async (req, res) => {
  try {
    const stations = await WeatherStation.find();
    res.status(200).json({ success: true, count: stations.length, data: stations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single weather station
// @route   GET /api/weather-stations/:id
const getWeatherStationById = async (req, res) => {
  try {
    const station = await WeatherStation.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ success: false, message: 'Weather station not found' });
    }
    res.status(200).json({ success: true, data: station });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new weather station
// @route   POST /api/weather-stations
const createWeatherStation = async (req, res) => {
  try {
    const { stationName, location, temperature, humidity, status } = req.body;

    if (!stationName || !location || temperature === undefined || humidity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide station name, location, temperature, and humidity',
      });
    }

    const station = await WeatherStation.create({
      stationName: stationName.trim(),
      location: location.trim(),
      temperature: Number(temperature),
      humidity: Number(humidity),
      status: status || 'Active',
    });

    res.status(201).json({ success: true, data: station });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update weather station
// @route   PUT /api/weather-stations/:id
const updateWeatherStation = async (req, res) => {
  try {
    const { stationName, location, temperature, humidity, status } = req.body;

    const updatePayload = {};
    if (stationName !== undefined) updatePayload.stationName = stationName.trim();
    if (location !== undefined) updatePayload.location = location.trim();
    if (temperature !== undefined) updatePayload.temperature = Number(temperature);
    if (humidity !== undefined) updatePayload.humidity = Number(humidity);
    if (status !== undefined) updatePayload.status = status;

    const station = await WeatherStation.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
    });
    if (!station) {
      return res.status(404).json({ success: false, message: 'Weather station not found' });
    }

    res.status(200).json({ success: true, data: station });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete weather station
// @route   DELETE /api/weather-stations/:id
const deleteWeatherStation = async (req, res) => {
  try {
    const station = await WeatherStation.findByIdAndDelete(req.params.id);
    if (!station) {
      return res.status(404).json({ success: false, message: 'Weather station not found' });
    }
    res.status(200).json({ success: true, message: 'Station deleted successfully', data: station });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWeatherStations,
  getWeatherStationById,
  createWeatherStation,
  updateWeatherStation,
  deleteWeatherStation,
};
