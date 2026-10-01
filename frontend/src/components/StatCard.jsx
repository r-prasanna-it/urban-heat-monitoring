import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = '#059669', bgLight = '#ecfdf5' }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon-wrapper" style={{ backgroundColor: bgLight, color: color }}>
        <Icon size={26} />
      </div>
      <div className="stat-info">
        <span className="stat-title">{title}</span>
        <span className="stat-value">{value}</span>
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      </div>
    </div>
  );
};

export default StatCard;
