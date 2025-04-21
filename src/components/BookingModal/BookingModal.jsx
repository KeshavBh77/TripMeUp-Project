// src/components/BookingModal/BookingModal.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  onSubmit,
  onChange
}) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

  // lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  // reset on open
  useEffect(() => {
    if (show) {
      setStep(0);
      setErrors({});
    }
  }, [show]);

  const validate = () => {
    const e = {};
    if (!from) e.from = "Check‑in date required";
    if (!to)   e.to   = "Check‑out date required";
    if (from && to && new Date(to) < new Date(from))
      e.dateRange = "Check‑out can’t be before check‑in";
    if (guests < 1 || guests > 10)
      e.guests = "Guests must be 1–10";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleNext = () => { if (validate()) setStep(1); };
  const handleConfirm = async () => {
    setStep(2);
    try {
      await new Promise(r => setTimeout(r, 1500));
      onSubmit({ place, dates: { from, to }, guests });
      setStep(3);
    } catch {
      setStep(1);
    }
  };
  const calculateNights = () =>
    Math.ceil((new Date(to) - new Date(from)) / (1000*60*60*24));

  if (!show || !place) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2>Book {place.title || place.name}</h2>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close">×</button>
        </header>
        <div className={styles.modalContent}>

          {/* Step 0: form */}
          {step === 0 && (
            <div className={styles.formSection}>
              <div className={styles.formGroup}>
                <label>Check‑in</label>
                <input
                  type="date"
                  min={today}
                  value={from}
                  onChange={e => onChange("from", e.target.value)}
                />
                {errors.from && <div className={styles.error}>{errors.from}</div>}
              </div>
              <div className={styles.formGroup}>
                <label>Check‑out</label>
                <input
                  type="date"
                  min={from || today}
                  value={to}
                  onChange={e => onChange("to", e.target.value)}
                />
                {errors.to && <div className={styles.error}>{errors.to}</div>}
              </div>
              {errors.dateRange && <div className={styles.error}>{errors.dateRange}</div>}
              <div className={styles.formGroup}>
                <label>Guests</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={guests}
                  onChange={e =>
                    onChange("guests",
                      Math.max(1, Math.min(10, parseInt(e.target.value) || 1))
                    )
                  }
                />
                {errors.guests && <div className={styles.error}>{errors.guests}</div>}
              </div>
              <button className={styles.primaryBtn} onClick={handleNext}>
                Review Booking
              </button>
            </div>
          )}

          {/* Step 1: review */}
          {step === 1 && (
            <div className={styles.reviewSection}>
              <h3 className={styles.reviewTitle}>Booking Summary</h3>
              <div className={styles.placePreview}>
                <img
                  src={place.image || place.imageUrl}
                  alt={place.title || place.name}
                  className={styles.placeImage}
                />
                <div className={styles.placeInfo}>
                  <h4>{place.title || place.name}</h4>
                  <div className={styles.rating}>
                    ★ {place.rating} ({place.reviews || "--"} reviews)
                  </div>
                </div>
              </div>

              {user && (
                <div className={styles.userDetails}>
                  <h4>Your Information</h4>
                  <div className={styles.detailItem}>
                    <dt>Name</dt>
                    <dd>{user.username || `${user.first} ${user.last}`}</dd>
                  </div>
                  <div className={styles.detailItem}>
                    <dt>Email</dt>
                    <dd>{user.email}</dd>
                  </div>
                </div>
              )}

              <dl className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <dt>Check‑in</dt>
                  <dd>{new Date(from).toLocaleDateString()}</dd>
                </div>
                <div className={styles.detailItem}>
                  <dt>Check‑out</dt>
                  <dd>{new Date(to).toLocaleDateString()}</dd>
                </div>
                <div className={styles.detailItem}>
                  <dt>Nights</dt>
                  <dd>{calculateNights()}</dd>
                </div>
                <div className={styles.detailItem}>
                  <dt>Guests</dt>
                  <dd>{guests} {guests>1 ? "people":"person"}</dd>
                </div>
              </dl>

              <div className={styles.priceSummary}>
                <div className={styles.priceRow}>
                  <span>${place.price} × {calculateNights()} nights</span>
                  <span>${place.price * calculateNights()}</span>
                </div>
                <div className={styles.priceRow}>
                  <span>Service fee</span>
                  <span>${(place.price * calculateNights() * 0.12).toFixed(2)}</span>
                </div>
                <div className={styles.totalPrice}>
                  <span>Total</span>
                  <span>${(place.price * calculateNights() * 1.12).toFixed(2)}</span>
                </div>
              </div>

              <div className={styles.buttonGroup}>
                <button className={styles.secondaryBtn} onClick={() => setStep(0)}>
                  Edit
                </button>
                <button className={styles.primaryBtn} onClick={handleConfirm}>
                  Confirm
                </button>
              </div>
            </div>
          )}

          {/* Step 2: loading */}
          {step === 2 && (
            <div className={styles.loadingSection}>
              <Spinner />
              <p>Securing your dates…</p>
            </div>
          )}

          {/* Step 3: success */}
          {step === 3 && (
            <div className={styles.successSection}>
              <div className={styles.successIcon}>✓</div>
              <h3>Booking Confirmed!</h3>
              <p className={styles.successText}>
                Your stay at {place.title||place.name} from{" "}
                {new Date(from).toLocaleDateString()} to{" "}
                {new Date(to).toLocaleDateString()} is confirmed.
              </p>
              <div className={styles.buttonGroupConfirm}>
                <button className={styles.secondaryBtn} onClick={onClose}>
                  Close
                </button>
                <button
                  className={styles.primaryBtn}
                  onClick={() => {
                    onClose();
                    navigate("/bookings");
                  }}
                >
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
