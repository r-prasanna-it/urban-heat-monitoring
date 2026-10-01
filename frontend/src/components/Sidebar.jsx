import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Flame,
  Trees,
  Radio,
  Wind,
  FileBarChart,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('urban_user') || '{"email":"admin@gmail.com"}');

  const handleLogout = () => {
    localStorage.removeItem('urban_auth_token');
    localStorage.removeItem('urban_user');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/hotspots', label: 'Heat Hotspots', icon: Flame },
    { path: '/green-cover', label: 'Green Cover', icon: Trees },
    { path: '/weather-stations', label: 'Weather Stations', icon: Radio },
    { path: '/cooling-initiatives', label: 'Cooling Initiatives', icon: Wind },
    { path: '/reports', label: 'Reports & Analytics', icon: FileBarChart },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <Trees size={22} />
        </div>
        <div className="sidebar-brand">
          <h2>UrbanHeat</h2>
          <span>Cooling Platform</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-badge">
          <div className="user-avatar">A</div>
          <div className="user-details">
            <span className="user-name">Admin</span>
            <span className="user-role">{user.email || 'admin@gmail.com'}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn-icon"
          title="Logout"
          style={{ color: '#d1fae5', borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
