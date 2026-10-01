const User = require('./User');
const Hotspot = require('./Hotspot');
const GreenCover = require('./GreenCover');
const WeatherStation = require('./WeatherStation');
const CoolingInitiative = require('./CoolingInitiative');
const { createAdapter } = require('./storeAdapter');
const {
  sampleUsers,
  sampleHotspots,
  sampleGreenCover,
  sampleWeatherStations,
  sampleCoolingInitiatives,
} = require('../seed/seedData');

module.exports = {
  // Raw Mongoose models for schema inspection or direct queries
  UserModel: User,
  HotspotModel: Hotspot,
  GreenCoverModel: GreenCover,
  WeatherStationModel: WeatherStation,
  CoolingInitiativeModel: CoolingInitiative,

  // Robust unified models (Mongoose connected or fallback)
  User: createAdapter(User, sampleUsers),
  Hotspot: createAdapter(Hotspot, sampleHotspots),
  GreenCover: createAdapter(GreenCover, sampleGreenCover),
  WeatherStation: createAdapter(WeatherStation, sampleWeatherStations),
  CoolingInitiative: createAdapter(CoolingInitiative, sampleCoolingInitiatives),
};
