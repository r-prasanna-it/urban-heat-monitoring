const mongoose = require('mongoose');
const {
  sampleUsers,
  sampleHotspots,
  sampleGreenCover,
  sampleWeatherStations,
  sampleCoolingInitiatives,
} = require('../seed/seedData');

let isConnected = false;

const seedDatabaseIfEmpty = async () => {
  try {
    const User = require('../models/User');
    const Hotspot = require('../models/Hotspot');
    const GreenCover = require('../models/GreenCover');
    const WeatherStation = require('../models/WeatherStation');
    const CoolingInitiative = require('../models/CoolingInitiative');

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.insertMany(sampleUsers);
      console.log('✅ Demo user seeded (admin@gmail.com / admin123)');
    }

    const hotspotCount = await Hotspot.countDocuments();
    if (hotspotCount === 0) {
      await Hotspot.insertMany(sampleHotspots);
      console.log('✅ 5 sample Heat Hotspots seeded');
    }

    const greenCoverCount = await GreenCover.countDocuments();
    if (greenCoverCount === 0) {
      await GreenCover.insertMany(sampleGreenCover);
      console.log('✅ 5 sample Green Cover records seeded');
    }

    const weatherCount = await WeatherStation.countDocuments();
    if (weatherCount === 0) {
      await WeatherStation.insertMany(sampleWeatherStations);
      console.log('✅ 4 sample Weather Stations seeded');
    }

    const coolingCount = await CoolingInitiative.countDocuments();
    if (coolingCount === 0) {
      await CoolingInitiative.insertMany(sampleCoolingInitiatives);
      console.log('✅ 5 sample Cooling Initiatives seeded');
    }
  } catch (error) {
    console.error('Error during automatic data seeding:', error.message);
  }
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/urban_heat_db';
  console.log(`[Database] Attempting connection to MongoDB: ${uri}`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout if no local MongoDB service
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedDatabaseIfEmpty();
  } catch (error) {
    console.warn(`[Database Notice] Could not connect to MongoDB server (${error.message}).`);
    console.log(`[Database Fallback] Built-in local memory database activated for instant demo mode!`);
    console.log(`[Database Fallback] All CRUD operations, charts, and maps will operate seamlessly.`);
    isConnected = false;
  }
};

module.exports = {
  connectDB,
  isDbConnected: () => isConnected,
  seedDatabaseIfEmpty,
};
