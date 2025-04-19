import React, { useState } from 'react';
import styles from './BookingModal.module.css';

export default function BookingModal({ isOpen, onClose, title, price, unit }) {
  const [dates, setDates] = useState({ from: '', to: '' });
  const [guests, setGuests] = useState(1);

  if (!isOpen) return null;

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: wire up booking API
    alert(`Booked ${title} for ${guests} guest(s) from ${dates.from} to ${dates.to}`);
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2>Book {title}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Check‑in
            <input
              type="date"
              value={dates.from}
              onChange={e => setDates(d => ({ ...d, from: e.target.value }))}
              required
            />
          </label>
          <label>
            Check‑out
            <input
              type="date"
              value={dates.to}
              onChange={e => setDates(d => ({ ...d, to: e.target.value }))}
              required
            />
          </label>
          <label>
            Guests
            <input
              type="number"
              min="1"
              value={guests}
              onChange={e => setGuests(e.target.value)}
              required
            />
          </label>
          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.cancel}>
              Cancel
            </button>
            <button type="submit" className={styles.confirm}>
              Confirm (${price} / {unit})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
