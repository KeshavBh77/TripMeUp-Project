// src/pages/AdminBookings/AdminBookings.jsx
import React, { useState, useContext, useEffect } from 'react';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import Skeleton from '../../components/Skeleton/Skeleton';
import { AuthContext } from '../../context/AuthContext';
import styles from './AdminBookings.module.css';
import { FaCalendarAlt, FaUserFriends, FaEdit, FaBan } from 'react-icons/fa';

export default function AdminBookings() {
  const { user } = useContext(AuthContext);

  // Hard‑coded sample bookings
  const [bookings, setBookings] = useState([
    {
      booking_id: 1,
      place: { name: 'Grand Plaza Hotel' },
      starting_date: '2025-07-10',
      ending_date:   '2025-07-15',
      no_of_guests:  2,
      client: { user: { first: 'Alice', last: 'Smith' } }
    },
    {
      booking_id: 2,
      place: { name: 'La Belle Cuisine' },
      starting_date: '2025-08-01',
      ending_date:   '2025-08-01',
      no_of_guests:  4,
      client: { user: { first: 'Bob', last: 'Johnson' } }
    }
  ]);

  // Cancel modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel]   = useState(null);

  // Modify modal state
  const [modifyModalOpen, setModifyModalOpen]   = useState(false);
  const [bookingToModify, setBookingToModify]   = useState(null);
  const [editDates, setEditDates]              = useState({ start: '', end: '' });
  const [editGuestsInput, setEditGuestsInput]  = useState('1');
  const [guestError, setGuestError]            = useState('');

  // Toast notification
  const [toast, setToast] = useState('');

  // Today's date for min attributes
  const today = new Date().toISOString().split('T')[0];

  // Auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  // Cancel flows
  const onCancelClick = booking => {
    setBookingToCancel(booking);
    setCancelModalOpen(true);
  };
  const confirmCancel = () => {
    setBookings(bs => bs.filter(b => b.booking_id !== bookingToCancel.booking_id));
    setCancelModalOpen(false);
    setBookingToCancel(null);
    setToast('Booking cancelled');
  };

  // Modify flows
  const onModifyClick = booking => {
    setBookingToModify(booking);
    setEditDates({ start: booking.starting_date, end: booking.ending_date });
    setEditGuestsInput(String(booking.no_of_guests));
    setGuestError('');
    setModifyModalOpen(true);
  };
  const confirmModify = () => {
    setBookings(bs =>
      bs.map(b =>
        b.booking_id === bookingToModify.booking_id
          ? {
              ...b,
              starting_date: editDates.start,
              ending_date:   editDates.end,
              no_of_guests:  parseInt(editGuestsInput, 10)
            }
          : b
      )
    );
    setModifyModalOpen(false);
    setBookingToModify(null);
    setToast('Booking updated');
  };

  return (
    <div className={styles.page}>
      <SectionTitle title="All Bookings" subtitle="Manage every reservation" />

      {toast && <div className={styles.toast}>{toast}</div>}

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
                  Client: {b.client?.user?.first} {b.client?.user?.last}
                </div>
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.modifyBtn}
                  onClick={() => onModifyClick(b)}
                >
                  <FaEdit /> Modify
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => onCancelClick(b)}
                >
                  <FaBan /> Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>
              Cancel booking at{' '}
              <em>{bookingToCancel.place.name}</em>?
            </h3>
            <div className={styles.modalActions}>
              <button
                className={`${styles.btn} ${styles.outline}`}
                onClick={() => setCancelModalOpen(false)}
              >
                No, keep it
              </button>
              <button
                className={`${styles.btn} ${styles.danger}`}
                onClick={confirmCancel}
              >
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modify Booking Modal */}
      {modifyModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>
              Modify booking at{' '}
              <em>{bookingToModify.place.name}</em>
            </h3>

            <div className={styles.formGroup}>
              <label>Check‑in</label>
              <input
                type="date"
                min={today}
                max={editDates.end || undefined}
                value={editDates.start}
                onChange={e => setEditDates(d => ({ ...d, start: e.target.value }))}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Check‑out</label>
              <input
                type="date"
                min={editDates.start || today}
                value={editDates.end}
                onChange={e => setEditDates(d => ({ ...d, end: e.target.value }))}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Guests (min 1)</label>
              <input
                type="number"
                min="1"
                value={editGuestsInput}
                onChange={e => {
                  const v = e.target.value;
                  setEditGuestsInput(v);
                  const n = parseInt(v, 10);
                  if (!n || n < 1) {
                    setGuestError('Guests must be at least 1');
                  } else {
                    setGuestError('');
                  }
                }}
              />
              {guestError && <div className={styles.error}>{guestError}</div>}
            </div>

            <div className={styles.modalActions}>
              <button
                className={`${styles.btn} ${styles.outline}`}
                onClick={() => setModifyModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`${styles.btn} ${styles.primary}`}
                onClick={confirmModify}
                disabled={!!guestError}
                style={{ opacity: guestError ? 0.5 : 1 }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
