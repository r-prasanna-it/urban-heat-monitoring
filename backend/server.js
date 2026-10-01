const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/hotspots', require('./routes/hotspotRoutes'));
app.use('/api/green-cover', require('./routes/greenCoverRoutes'));
app.use('/api/weather-stations', require('./routes/weatherStationRoutes'));
app.use('/api/cooling-initiatives', require('./routes/coolingInitiativeRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Root endpoint for API inspection
app.get('/', (req, res) => {
  res.json({
    project: 'Urban Heat Monitoring & Cooling Platform API',
    status: 'Running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/login',
      hotspots: '/api/hotspots',
      greenCover: '/api/green-cover',
      weatherStations: '/api/weather-stations',
      coolingInitiatives: '/api/cooling-initiatives',
      reportsSummary: '/api/reports/summary',
      downloadCsv: '/api/reports/download-csv',
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌿 Urban Heat Monitoring Server running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
