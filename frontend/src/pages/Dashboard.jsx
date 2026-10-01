import React, { useEffect, useState, useRef } from 'react';
import {
  Flame,
  Thermometer,
  Trees,
  Radio,
  Wind,
  MapPin,
  BarChart3,
  PieChart,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import L from 'leaflet';
import StatCard from '../components/StatCard';
import { getReportSummary } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getReportSummary();
      if (res.success) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard metrics from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || !summary || !summary.hotspots) return;

    // Remove existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const defaultLat = summary.hotspots[0]?.latitude || 12.9716;
    const defaultLng = summary.hotspots[0]?.longitude || 77.5946;

    const map = L.map(mapContainerRef.current).setView([defaultLat, defaultLng], 12);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const bounds = [];

    summary.hotspots.forEach((spot) => {
      if (spot.latitude && spot.longitude) {
        const color =
          spot.severity === 'High' ? '#ef4444' : spot.severity === 'Medium' ? '#f59e0b' : '#10b981';

        const circle = L.circleMarker([spot.latitude, spot.longitude], {
          radius: 12,
          fillColor: color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        }).addTo(map);

        circle.bindPopup(`
          <div style="font-family: inherit; font-size: 13px; line-height: 1.4;">
            <strong style="color: #0f172a; font-size: 14px;">${spot.location}</strong><br/>
            <span>Temperature: <b style="color: ${color};">${spot.temperature}°C</b></span><br/>
            <span>Severity: <b>${spot.severity}</b></span><br/>
            <small style="color: #64748b;">${new Date(spot.date).toLocaleDateString()}</small>
          </div>
        `);

        bounds.push([spot.latitude, spot.longitude]);
      }
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [summary]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
        <p>Loading environmental dashboard data...</p>
      </div>
    );
  }

  // Heat Hotspot Chart Data
  const heatChartData = {
    labels: summary?.hotspots?.map((h) => h.location.split(' ')[0] + '..') || [],
    datasets: [
      {
        label: 'Recorded Temperature (°C)',
        data: summary?.hotspots?.map((h) => h.temperature) || [],
        backgroundColor: summary?.hotspots?.map((h) =>
          h.severity === 'High'
            ? 'rgba(239, 68, 68, 0.75)'
            : h.severity === 'Medium'
            ? 'rgba(245, 158, 11, 0.75)'
            : 'rgba(16, 185, 129, 0.75)'
        ) || [],
        borderColor: summary?.hotspots?.map((h) =>
          h.severity === 'High' ? '#dc2626' : h.severity === 'Medium' ? '#d97706' : '#059669'
        ) || [],
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  // Green Cover Chart Data
  const greenCoverChartData = {
    labels: summary?.greenCovers?.map((g) => g.location.split(' ')[0] + '..') || [],
    datasets: [
      {
        label: 'Green Cover %',
        data: summary?.greenCovers?.map((g) => g.greenCoverPercentage) || [],
        backgroundColor: 'rgba(5, 150, 105, 0.75)',
        borderColor: '#047857',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* 5 Simple Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Heat Hotspots"
          value={summary?.totalHotspots ?? 0}
          subtitle={`${summary?.highSeverityHotspots || 0} High Severity`}
          icon={Flame}
          color="#ef4444"
          bgLight="#fee2e2"
        />
        <StatCard
          title="Average Temperature"
          value={`${summary?.avgTemperature ?? 0}°C`}
          subtitle="City Urban Zones"
          icon={Thermometer}
          color="#f59e0b"
          bgLight="#fef3c7"
        />
        <StatCard
          title="Green Cover %"
          value={`${summary?.avgGreenCover ?? 0}%`}
          subtitle="Target: > 45%"
          icon={Trees}
          color="#059669"
          bgLight="#ecfdf5"
        />
        <StatCard
          title="Active Weather Stations"
          value={summary?.activeWeatherStations ?? 0}
          subtitle={`Out of ${summary?.totalWeatherStations || 0} total`}
          icon={Radio}
          color="#3b82f6"
          bgLight="#e0f2fe"
        />
        <StatCard
          title="Active Cooling Initiatives"
          value={summary?.activeCoolingInitiatives ?? 0}
          subtitle={`${summary?.completedCoolingInitiatives || 0} Completed`}
          icon={Wind}
          color="#0d9488"
          bgLight="#ccfbf1"
        />
      </div>

      {/* Charts Grid */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>
              <BarChart3 size={18} color="#ef4444" />
              Heat Hotspot Temperatures (°C)
            </h3>
          </div>
          <div className="card-body" style={{ height: '280px' }}>
            <Bar data={heatChartData} options={chartOptions} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>
              <BarChart3 size={18} color="#059669" />
              Green Cover Percentage by Location (%)
            </h3>
          </div>
          <div className="card-body" style={{ height: '280px' }}>
            <Bar data={greenCoverChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Heat Map Section */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3>
            <MapPin size={18} color="#ef4444" />
            Heat Hotspot Geographic Map (Leaflet.js)
          </h3>
          <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} /> High Heat
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} /> Medium Heat
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} /> Low Heat
            </span>
          </div>
        </div>
        <div className="card-body" style={{ padding: '0' }}>
          <div ref={mapContainerRef} className="map-container" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
