import React, { useState, useEffect } from 'react';
import {
  Download,
  Flame,
  Thermometer,
  Trees,
  Radio,
  Wind,
  AlertTriangle,
  PieChart,
  BarChart3,
  FileSpreadsheet,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import StatCard from '../components/StatCard';
import { getReportSummary, downloadCsvReportUrl } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await getReportSummary();
      if (res.success) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleDownloadCsv = () => {
    // Direct browser download from backend CSV endpoint
    window.open(downloadCsvReportUrl, '_blank');
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
        <p>Generating environmental analytics and report...</p>
      </div>
    );
  }

  // 1. Hotspot Severity Distribution Chart (Doughnut)
  const severityChartData = {
    labels: ['High Severity', 'Medium Severity', 'Low Severity'],
    datasets: [
      {
        data: [
          summary?.highSeverityHotspots || 0,
          summary?.mediumSeverityHotspots || 0,
          summary?.lowSeverityHotspots || 0,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.85)',
          'rgba(245, 158, 11, 0.85)',
          'rgba(16, 185, 129, 0.85)',
        ],
        borderColor: ['#dc2626', '#d97706', '#059669'],
        borderWidth: 1,
      },
    ],
  };

  // 2. Cooling Initiatives Status Breakdown (Bar)
  const initiativesByStatus = {
    Planned: summary?.coolingInitiatives?.filter((i) => i.status === 'Planned').length || 0,
    Ongoing: summary?.coolingInitiatives?.filter((i) => i.status === 'Ongoing').length || 0,
    Completed: summary?.coolingInitiatives?.filter((i) => i.status === 'Completed').length || 0,
  };

  const initiativeStatusChartData = {
    labels: ['Planned', 'Ongoing', 'Completed'],
    datasets: [
      {
        label: 'Number of Initiatives',
        data: [
          initiativesByStatus.Planned,
          initiativesByStatus.Ongoing,
          initiativesByStatus.Completed,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.75)',
          'rgba(245, 158, 11, 0.75)',
          'rgba(16, 185, 129, 0.75)',
        ],
        borderColor: ['#2563eb', '#d97706', '#059669'],
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: '#f1f5f9' },
      },
      x: { grid: { display: false } },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 12, padding: 16 },
      },
    },
  };

  return (
    <div>
      {/* Header bar with Download CSV action */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
            Environmental Reports & Analytics
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Aggregated municipal environmental metrics and downloadable audit data
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleDownloadCsv}>
          <Download size={16} />
          <span>Download Report (CSV)</span>
        </button>
      </div>

      {/* 6 Key Report Metrics Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <StatCard
          title="Total Hotspots"
          value={summary?.totalHotspots ?? 0}
          icon={Flame}
          color="#ef4444"
          bgLight="#fee2e2"
        />
        <StatCard
          title="High Severity Hotspots"
          value={summary?.highSeverityHotspots ?? 0}
          icon={AlertTriangle}
          color="#dc2626"
          bgLight="#fee2e2"
        />
        <StatCard
          title="Average Temperature"
          value={`${summary?.avgTemperature ?? 0}°C`}
          icon={Thermometer}
          color="#f59e0b"
          bgLight="#fef3c7"
        />
        <StatCard
          title="Average Green Cover"
          value={`${summary?.avgGreenCover ?? 0}%`}
          icon={Trees}
          color="#059669"
          bgLight="#ecfdf5"
        />
        <StatCard
          title="Active Weather Stations"
          value={summary?.activeWeatherStations ?? 0}
          icon={Radio}
          color="#3b82f6"
          bgLight="#e0f2fe"
        />
        <StatCard
          title="Cooling Initiatives"
          value={summary?.totalCoolingInitiatives ?? 0}
          icon={Wind}
          color="#0d9488"
          bgLight="#ccfbf1"
        />
      </div>

      {/* 2 Charts */}
      <div className="dashboard-grid" style={{ marginTop: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h3>
              <PieChart size={18} color="#ef4444" />
              Hotspot Severity Distribution
            </h3>
          </div>
          <div className="card-body" style={{ height: '280px' }}>
            <Doughnut data={severityChartData} options={doughnutChartOptions} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>
              <BarChart3 size={18} color="#0d9488" />
              Cooling Initiatives by Status
            </h3>
          </div>
          <div className="card-body" style={{ height: '280px' }}>
            <Bar data={initiativeStatusChartData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Report Info Card */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3>
            <FileSpreadsheet size={18} color="#059669" />
            Exportable Environmental Dataset
          </h3>
        </div>
        <div className="card-body">
          <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '14px' }}>
            Clicking the <strong>Download Report (CSV)</strong> button exports all currently stored
            environmental observations including Heat Hotspots, Green Cover, Weather Stations, and
            Cooling Initiatives into a single spreadsheet document formatted for analysis.
          </p>
          <button className="btn btn-secondary" onClick={handleDownloadCsv}>
            <Download size={15} />
            <span>Generate & Download CSV File</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
