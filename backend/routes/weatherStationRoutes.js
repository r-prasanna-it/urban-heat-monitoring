const express = require('express');
const router = express.Router();
const {
  getWeatherStations,
  getWeatherStationById,
  createWeatherStation,
  updateWeatherStation,
  deleteWeatherStation,
} = require('../controllers/weatherStationController');

router.route('/')
  .get(getWeatherStations)
  .post(createWeatherStation);

router.route('/:id')
  .get(getWeatherStationById)
  .put(updateWeatherStation)
  .delete(deleteWeatherStation);

module.exports = router;
