// src/pages/AdminBookings/AdminBookings.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import Skeleton from '../../components/Skeleton/Skeleton';
import { AuthContext } from '../../context/AuthContext';
import styles from './AdminBookings.module.css';
import { FaCalendarAlt, FaUserFriends, FaEdit } from 'react-icons/fa';

export default function AdminBookings() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Only admins should view this
    if (!user?.isAdmin) {
      navigate('/login');
      return;
    }
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8000/TripMeUpApp/booking/');
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error loading bookings:', err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user, navigate]);

  return (
    <div className={styles.page}>
      <SectionTitle title="All Bookings" subtitle="Manage every reservation" />

      {loading ? (
        <div className={styles.list}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.cardWrapper}>
              <Skeleton height="200px" radius="12px" />
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className={styles.empty}>
          <h3>No bookings found.</h3>
        </div>
      ) : (
        <div className={styles.list}>
          {bookings.map(b => (
            <div key={b.booking_id} className={styles.cardWrapper}>
              <div className={`${styles.card} neo-embed`}>
                <div className={styles.info}>
                  <h3>{b.place?.name || 'Unknown Place'}</h3>
                  <div className={styles.meta}>
                    <span><FaCalendarAlt /> {b.starting_date} → {b.ending_date}</span>
                    <span><FaUserFriends /> {b.no_of_guests} guest{b.no_of_guests > 1 ? 's' : ''}</span>
                  </div>
                  <div className={styles.client}>
                    Client: {b.client?.user?.first || b.client?.user || '—'}  
                  </div>
                </div>
                <button
                  className={styles.modifyBtn}
                  onClick={() => navigate(`/modify-booking/${b.booking_id}`)}
                >
                  <FaEdit /> Modify Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
