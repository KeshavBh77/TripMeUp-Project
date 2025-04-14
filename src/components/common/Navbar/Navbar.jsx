// src/components/common/Navbar/Navbar.jsx
import React from 'react';
import './Navbar.css';

const Navbar = ({ setCurrentPage }) => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo" onClick={() => setCurrentPage('home')}>
          <span className="logo-icon">✈️</span>
          <span className="logo-text">TripMeUp</span>
        </div>
        
        <div className="nav-links">
          <button className="nav-link" onClick={() => setCurrentPage('home')}>Home</button>
          <button className="nav-link" onClick={() => setCurrentPage('booking')}>Bookings</button>
          <button className="nav-link" onClick={() => setCurrentPage('user')}>Account</button>
        </div>
        
        <div className="nav-actions">
          <button className="btn btn-primary">Sign In</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;