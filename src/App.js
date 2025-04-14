// src/App.js
import React, { useState } from 'react';
import Navbar from './components/common/Navbar/Navbar';
import Home from './pages/Home/Home';
import User from './pages/User/User';
import Booking from './pages/Booking/Booking';
import './assets/styles/global.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'user':
        return <User />;
      case 'booking':
        return <Booking />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app">
      <Navbar setCurrentPage={setCurrentPage} />
      <main>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;