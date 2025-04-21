import React, { useState, useEffect } from "react";
import styles from "./BookingModal.module.css";

export default function BookingModal({
  show,
  place,
  guests,
  from,
  to,
  guestNames,
  onClose,
  onSubmit,
  onChange
}) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const totalSteps = guests;
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (guests > guestNames.length) {
      const newNames = [...guestNames, ...Array(guests - guestNames.length).fill("")];
      onChange("guestNames", newNames);
    } else if (guests < guestNames.length) {
      onChange("guestNames", guestNames.slice(0, guests));
    }
  }, [guests]);

  useEffect(() => {
    if (show) setStep(0);
  }, [show]);

  const validateStep = () => {
    const newErrors = {};
    
    if (step === 0) {
      if (!from) newErrors.from = "Start date is required";
      if (!to) newErrors.to = "End date is required";
      if (new Date(to) < new Date(from)) newErrors.dateRange = "End date cannot be before start date";
      if (guests < 1 || guests > 10) newErrors.guests = "Guests must be between 1-10";
    } else {
      if (!guestNames[step - 1]?.trim()) newErrors.name = "Guest name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep(s => s + 1);
  };

  const handleSubmit = () => {
    if (validateStep()) {
      onSubmit({ place, dates: { from, to }, guests, guestNames });
    }
  };

  if (!show || !place) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Book Your Stay at {place.name}</h2>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close">
            &times;
          </button>
        </div>

        <div className={styles.progress}>
          <div style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>

        <div className={styles.content}>
          {step === 0 ? (
            <div className={styles.formSection}>
              <div className={styles.formGroup}>
                <label htmlFor="fromDate">Start Date</label>
                <input
                  id="fromDate"
                  type="date"
                  min={today}
                  value={from}
                  onChange={(e) => onChange("from", e.target.value)}
                  aria-invalid={!!errors.from}
                />
                {errors.from && <span className={styles.error}>{errors.from}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="toDate">End Date</label>
                <input
                  id="toDate"
                  type="date"
                  min={from || today}
                  value={to}
                  onChange={(e) => onChange("to", e.target.value)}
                  aria-invalid={!!errors.to}
                />
                {errors.to && <span className={styles.error}>{errors.to}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="guests">Number of Guests</label>
                <input
                  id="guests"
                  type="number"
                  min="1"
                  max="10"
                  value={guests}
                  onChange={(e) => onChange("guests", Math.max(1, Math.min(10, e.target.value)))}
                  aria-invalid={!!errors.guests}
                />
                {errors.guests && <span className={styles.error}>{errors.guests}</span>}
              </div>
              {errors.dateRange && <div className={styles.error}>{errors.dateRange}</div>}
            </div>
          ) : (
            <div className={styles.formSection}>
              <div className={styles.formGroup}>
                <label htmlFor={`guest-${step}`}>Guest {step} Name</label>
                <input
                  id={`guest-${step}`}
                  type="text"
                  value={guestNames[step - 1] || ""}
                  onChange={(e) => {
                    const updated = [...guestNames];
                    updated[step - 1] = e.target.value;
                    onChange("guestNames", updated);
                  }}
                  placeholder={`Guest ${step} Full Name`}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <span className={styles.error}>{errors.name}</span>}
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.buttonGroup}>
            {step > 0 && (
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setStep(s => s - 1)}
              >
                Back
              </button>
            )}
            
            {step < totalSteps ? (
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handleNext}
              >
                {step === 0 ? `Continue (${guests} Guest${guests > 1 ? 's' : ''})` : 'Next'}
              </button>
            ) : (
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handleSubmit}
              >
                Confirm Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}