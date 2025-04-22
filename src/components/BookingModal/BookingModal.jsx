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
  onChange
}) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

  // dynamic preview image
  const previewSrc = useUnsplash(place?.name);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  useEffect(() => {
    if (show) {
      setStep(0);
      setErrors({});
    }
  }, [show]);

  const validate = () => {
    const e = {};
    if (!from) e.from = "Check‑in date required";
    if (!to) e.to = "Check‑out date required";
    if (from && to && new Date(to) < new Date(from)) e.dateRange = "Check‑out can’t be before check‑in";
    if (guests < 1) e.guests = "Must have at least 1 guest";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) setStep(1);
  };

  const handleConfirm = async () => {
    setStep(2);
    try {
      const res = await fetch("http://localhost:8000/TripMeUpApp/booking/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          place_id: place.place_id,
          starting_date: from,
          ending_date: to,
          no_of_guests: guests
        })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Booking failed");
      }
      await res.json();
      setStep(3);
    } catch (err) {
      console.error(err);
      setStep(1);
      setErrors({ submit: err.message });
    }
  };

  const calculateNights = () =>
    Math.ceil((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24));

  if (!show || !place) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2>Book {place.name}</h2>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close">
            ×
          </button>
        </header>
        <div className={styles.modalContent}>
          {step === 0 && (
            <div className={styles.formSection}>
              {/* …same form as before… */}
              <button className={styles.primaryBtn} onClick={handleNext}>
                Review Booking
              </button>
            </div>
          )}
          {step === 1 && (
            <div className={styles.reviewSection}>
              <h3 className={styles.reviewTitle}>Booking Summary</h3>
              <div className={styles.placePreview}>
                <img
                  src={previewSrc || `https://via.placeholder.com/200?text=${encodeURIComponent(place.name)}`}
                  alt={place.name}
                  className={styles.placeImage}
                />
                <div className={styles.placeInfo}>
                  <h4>{place.name}</h4>
                </div>
              </div>
              <dl className={styles.detailGrid}>
                {/* check‑in, check‑out, nights, guests */}
              </dl>
              {errors.submit && <div className={styles.error}>{errors.submit}</div>}
              <div className={styles.buttonGroup}>
                <button className={styles.secondaryBtn} onClick={() => setStep(0)}>
                  Edit
                </button>
                <button className={styles.primaryBtn} onClick={handleConfirm}>
                  Confirm & Create
                </button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className={styles.loadingSection}>
              <Spinner />
              <p>Securing your dates…</p>
            </div>
          )}
          {step === 3 && (
            <div className={styles.successSection}>
              <div className={styles.successIcon}>✓</div>
              <h3>Booking Confirmed!</h3>
              <p>
                Your stay at <strong>{place.name}</strong> from{" "}
                {new Date(from).toLocaleDateString()} to{" "}
                {new Date(to).toLocaleDateString()} has been booked.
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
