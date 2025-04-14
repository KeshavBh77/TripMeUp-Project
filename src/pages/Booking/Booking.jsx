import React, { useState } from 'react';
import './Booking.css';

const Booking = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    place: '',
    date: '',
    guests: 1,
    status: 'confirmed'
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log('Searching bookings:', searchTerm);
  };

  const handleBookingSelect = (booking) => {
    setSelectedBooking(booking);
    setBookingForm({
      place: booking.place,
      date: booking.date,
      guests: booking.guests,
      status: booking.status
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log('Booking data submitted:', bookingForm);
    setIsEditing(false);
  };

  return (
    <div className="booking-module">
      <div className="container">
        <h1>Booking Management</h1>
        
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Search Bookings
          </button>
          <button 
            className={`tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Booking
          </button>
        </div>
        
        {activeTab === 'search' ? (
          <>
            <section className="search-section">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="btn btn-primary">Search</button>
              </form>
            </section>
            
            <div className="booking-list">
              <h2>Recent Bookings</h2>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Place</th>
                    <th>Date</th>
                    <th>Guests</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? (
                    bookings.map(booking => (
                      <tr 
                        key={booking.id}
                        className={selectedBooking?.id === booking.id ? 'active' : ''}
                      >
                        <td>{booking.id}</td>
                        <td>{booking.place}</td>
                        <td>{booking.date}</td>
                        <td>{booking.guests}</td>
                        <td>
                          <span className={`status ${booking.status}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn"
                            onClick={() => handleBookingSelect(booking)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No bookings found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {selectedBooking && (
              <div className="booking-details">
                <h2>Booking Details</h2>
                <div className="detail-card">
                  <div className="detail-row">
                    <span className="detail-label">Place:</span>
                    <span className="detail-value">{selectedBooking.place}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{selectedBooking.date}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Guests:</span>
                    <span className="detail-value">{selectedBooking.guests}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className={`detail-value status ${selectedBooking.status}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-primary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </button>
                    <button className="btn">Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="create-booking">
            <h2>Create New Booking</h2>
            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-group">
                <label>Place</label>
                <input
                  type="text"
                  name="place"
                  value={bookingForm.place}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={bookingForm.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Number of Guests</label>
                <input
                  type="number"
                  name="guests"
                  value={bookingForm.guests}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={bookingForm.status}
                  onChange={handleInputChange}
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        )}
        
        {isEditing && (
          <div className="edit-modal">
            <div className="modal-content">
              <h2>Edit Booking</h2>
              <form onSubmit={handleSubmit} className="booking-form">
                <div className="form-group">
                  <label>Place</label>
                  <input
                    type="text"
                    name="place"
                    value={bookingForm.place}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={bookingForm.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Number of Guests</label>
                  <input
                    type="number"
                    name="guests"
                    value={bookingForm.guests}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={bookingForm.status}
                    onChange={handleInputChange}
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    className="btn"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;