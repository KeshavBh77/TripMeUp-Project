// src/components/BookingModal/BookingModal.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUnsplash from "../../hooks/useUnsplash";
import styles from "./BookingModal.module.css";
import Spinner from "../Loading/Spinner";

export default function BookingModal({
  user,
  show,
  place,
  guests,
  from,
  to,
  onClose,
  onChange,
  onSubmit,
  children,
}) {
  const [step, setStep]     = useState(0);
  const [errors, setErrors] = useState({});
  const today               = new Date().toISOString().split("T")[0];
  const navigate            = useNavigate();

  // lock scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  // reset whenever the modal opens
  useEffect(() => {
    if (show) {
      setStep(0);
      setErrors({});
    }
  }, [show]);

  // pull in a hero image for this place
  const imgSrc = useUnsplash(place?.imageDescription || place?.name);

  // simple form validation
  const validate = () => {
    const e = {};
    if (!from) e.from = "Check-in date required";
    if (!to)   e.to   = "Check-out date required";
    if (from && to) {
      const d1 = parseLocalDate(from), d2 = parseLocalDate(to);
      if (d2 < d1) e.dateRange = "Check-out can’t be before check-in";
    }
    if (guests < 1) e.guests = "Must have at least 1 guest";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleNext = () => { if (validate()) setStep(1); };
  const handleConfirm = async () => {
    setStep(2);
    try {
      const res = await fetch("http://localhost:8000/TripMeUpApp/booking/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id:       user.user_id,
          place_id:      place.place_id,
          starting_date: from,
          ending_date:   to,
          no_of_guests:  guests,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || err.detail || "Booking failed");
      }
      await res.json();
      setStep(3);
      onSubmit({ place, dates: { from, to }, guests });
    } catch (err) {
      setErrors({ submit: err.message });
      setStep(1);
    }
  };

  // date helpers
  const parseLocalDate = (str) => {
    const [y,m,d] = str.split("-").map(Number);
    return new Date(y,m-1,d);
  };
  const formatLocalDate = (str) => parseLocalDate(str).toLocaleDateString();
  const calculateNights = () => {
    const d1 = parseLocalDate(from), d2 = parseLocalDate(to);
    return Math.ceil((d2 - d1) / (1000*60*60*24));
  };

  if (!show) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2>Book {place?.name || "—"}</h2>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close">×</button>
        </header>

        <div className={styles.modalContent}>
          {/* STEP 0: form */}
          {step === 0 && (
            <div className={styles.formSection}>
              {children}
              <div className={styles.formGroup}>
                <label>Check-in</label>
                <input type="date" min={today} value={from}
                  onChange={e => onChange("from", e.target.value)} />
                {errors.from && <div className={styles.error}>{errors.from}</div>}
              </div>
              <div className={styles.formGroup}>
                <label>Check-out</label>
                <input type="date" min={from||today} value={to}
                  onChange={e => onChange("to", e.target.value)} />
                {errors.to && <div className={styles.error}>{errors.to}</div>}
              </div>
              {errors.dateRange && <div className={styles.error}>{errors.dateRange}</div>}
              <div className={styles.formGroup}>
                <label>Guests</label>
                <input type="number" min="1" value={guests}
                  onChange={e => onChange("guests", Math.max(1,parseInt(e.target.value)||1))} />
                {errors.guests && <div className={styles.error}>{errors.guests}</div>}
              </div>
              <button className={styles.primaryBtn} onClick={handleNext}>
                Review Booking
              </button>
            </div>
          )}

          {/* STEP 1: review */}
          {step === 1 && (
            <div className={styles.reviewSection}>
              <h3 className={styles.reviewTitle}>Booking Summary</h3>
              <div className={styles.placePreview}>
                <img src={imgSrc} alt={place?.name} className={styles.placeImage} />
                <div className={styles.placeInfo}>
                  <h4>{place?.name}</h4>
                </div>
              </div>
              <dl className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <dt>Check-in</dt><dd>{formatLocalDate(from)}</dd>
                </div>
                <div className={styles.detailItem}>
                  <dt>Check-out</dt><dd>{formatLocalDate(to)}</dd>
                </div>
                <div className={styles.detailItem}>
                  <dt>Nights</dt><dd>{calculateNights()}</dd>
                </div>
                <div className={styles.detailItem}>
                  <dt>Guests</dt><dd>{guests}</dd>
                </div>
              </dl>
              {errors.submit && <div className={styles.error}>{errors.submit}</div>}
              <div className={styles.buttonGroup}>
                <button className={styles.secondaryBtn} onClick={() => setStep(0)}>
                  Edit
                </button>
                <button className={styles.primaryBtn} onClick={handleConfirm}>
                  Confirm &amp; Create
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: loading */}
          {step === 2 && (
            <div className={styles.loadingSection}>
              <Spinner />
              <p>Securing your dates…</p>
            </div>
          )}

          {/* STEP 3: success */}
          {step === 3 && (
            <div className={styles.successSection}>
              <div className={styles.successIcon}>✓</div>
              <h3>Booking Confirmed!</h3>
              <p>
                Your stay at <strong>{place?.name}</strong> from {formatLocalDate(from)} to {formatLocalDate(to)} has been booked.
              </p>
              <div className={styles.buttonGroupConfirm}>
                <button className={styles.secondaryBtn} onClick={onClose}>
                  Close
                </button>
                <button className={styles.primaryBtn} onClick={() => {
                  onClose();
                  navigate("/bookings");
                }}>
                  View My Bookings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
