import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HeatHotspots from './pages/HeatHotspots';
import GreenCover from './pages/GreenCover';
import WeatherStations from './pages/WeatherStations';
import CoolingInitiatives from './pages/CoolingInitiatives';
import Reports from './pages/Reports';

// Layout wrapper for authenticated dashboard pages
const AppLayout = ({ children, title }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title={title} />
        <main className="page-wrapper">{children}</main>
      </div>
    </div>
  );
};

// Simple Protected Route check
const ProtectedRoute = ({ children, title }) => {
  const token = localStorage.getItem('urban_auth_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <AppLayout title={title}>{children}</AppLayout>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute title="City Environmental Overview Dashboard">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/hotspots"
          element={
            <ProtectedRoute title="Urban Heat Hotspots Monitoring">
              <HeatHotspots />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/green-cover"
          element={
            <ProtectedRoute title="Urban Green Cover & Canopy Density">
              <GreenCover />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/weather-stations"
          element={
            <ProtectedRoute title="Automated Weather Stations Registry">
              <WeatherStations />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/cooling-initiatives"
          element={
            <ProtectedRoute title="Urban Heat Cooling Initiatives">
              <CoolingInitiatives />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/reports"
          element={
            <ProtectedRoute title="Environmental Reports & Analytics">
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Default route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
