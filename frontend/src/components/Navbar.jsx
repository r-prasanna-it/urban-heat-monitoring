import React from 'react';


const Navbar = ({ title }) => {
  return (
    <header className="top-navbar">
      <div className="navbar-title">
        <span>{title}</span>
      </div>

      <div className="navbar-actions">
        <div className="env-indicator">
          <span className="pulse-dot"></span>
          <span>Live Environmental Monitoring</span>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
