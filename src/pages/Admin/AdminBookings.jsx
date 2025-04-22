// src/pages/AdminBookings/AdminBookings.jsx
import React, { useState, useEffect } from 'react';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import Skeleton from '../../components/Skeleton/Skeleton';
import styles from './AdminBookings.module.css';
import { FaCalendarAlt, FaUserFriends, FaEdit, FaBan } from 'react-icons/fa';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [modifyModalOpen, setModifyModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [bookingToModify, setBookingToModify] = useState(null);
  const [editDates, setEditDates] = useState({ start: '', end: '' });
  const [editGuestsInput, setEditGuestsInput] = useState('1');
  const [guestError, setGuestError] = useState('');
  const [toast, setToast] = useState('');
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/TripMeUpApp/admin-booking/');
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
    setLoading(false);
  };

  const onCancelClick = (booking) => {
    setBookingToCancel(booking);
    setCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    try {
      await fetch(`http://localhost:8000/TripMeUpApp/admin-booking/${bookingToCancel.booking_id}/`, {
        method: 'DELETE',
      });
      setToast('Booking cancelled');
      fetchBookings();
    } catch (err) {
      console.error('Cancel failed:', err);
    }
    setCancelModalOpen(false);
    setBookingToCancel(null);
  };

  const onModifyClick = (booking) => {
    setBookingToModify(booking);
    setEditDates({ start: booking.starting_date, end: booking.ending_date });
    setEditGuestsInput(String(booking.no_of_guests));
    setGuestError('');
    setModifyModalOpen(true);
  };

  const confirmModify = async () => {
    try {
      const response = await fetch(`http://localhost:8000/TripMeUpApp/admin-booking/${bookingToModify.booking_id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          starting_date: editDates.start,
          ending_date: editDates.end,
          no_of_guests: parseInt(editGuestsInput),
        }),
      });
      if (response.ok) {
        setToast('Booking updated');
        fetchBookings();
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
    setModifyModalOpen(false);
    setBookingToModify(null);
  };

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <div className={styles.page}>
      <SectionTitle title="All Bookings" subtitle="Manage every reservation" />
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.list}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.cardWrapper}>
              <Skeleton height="260px" radius="20px" />
            </div>
          ))
        ) : (
          bookings.map((b) => (
            <div key={b.booking_id} className={styles.cardWrapper}>
              <div className={`${styles.card} neo-embed`}>
                <div className={styles.info}>
                  <h3>{b.place?.name || 'Unknown Place'}</h3>
                  <div className={styles.meta}>
                    <span><FaCalendarAlt /> {b.starting_date} → {b.ending_date}</span>
                    <span><FaUserFriends /> {b.no_of_guests} Guests</span>
                  </div>
                  <div className={styles.client}>
                    Client: {b.client?.user?.first} {b.client?.user?.last}
                  </div>
                </div>
                <div className={styles.actions}>
                  <button className={styles.modifyBtn} onClick={() => onModifyClick(b)}>
                    <FaEdit /> Modify
                  </button>
                  <button className={styles.cancelBtn} onClick={() => onCancelClick(b)}>
                    <FaBan /> Cancel
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cancelModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Cancel booking at <em>{bookingToCancel.place.name}</em>?</h3>
            <div className={styles.modalActions}>
              <button className={`${styles.btn} ${styles.outline}`} onClick={() => setCancelModalOpen(false)}>No, keep it</button>
              <button className={`${styles.btn} ${styles.danger}`} onClick={confirmCancel}>Yes, cancel</button>
            </div>
          </div>
        </div>
      )}

      {modifyModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Modify booking at <em>{bookingToModify.place.name}</em></h3>
            <div className={styles.formGroup}>
              <label>Check‑in</label>
              <input type="date" min={today} max={editDates.end || undefined} value={editDates.start}
                onChange={e => setEditDates(d => ({ ...d, start: e.target.value }))} />
            </div>
            <div className={styles.formGroup}>
              <label>Check‑out</label>
              <input type="date" min={editDates.start || today} value={editDates.end}
                onChange={e => setEditDates(d => ({ ...d, end: e.target.value }))} />
            </div>
            <div className={styles.formGroup}>
              <label>Guests (min 1)</label>
              <input type="number" min="1" value={editGuestsInput}
                onChange={e => {
                  const v = e.target.value;
                  setEditGuestsInput(v);
                  const n = parseInt(v, 10);
                  if (!n || n < 1) {
                    setGuestError('Guests must be at least 1');
                  } else {
                    setGuestError('');
                  }
                }} />
              {guestError && <div className={styles.error}>{guestError}</div>}
            </div>
            <div className={styles.modalActions}>
              <button className={`${styles.btn} ${styles.outline}`} onClick={() => setModifyModalOpen(false)}>Cancel</button>
              <button className={`${styles.btn} ${styles.primary}`} onClick={confirmModify} disabled={!!guestError}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
