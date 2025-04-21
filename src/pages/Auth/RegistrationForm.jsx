// src/pages/Auth/RegisterForm.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { validateStep1, validateStep2, validateStep3 } from '../../utils/validators';
import styles from './Auth.module.css';

export default function RegisterForm({ switchTab }) {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // form state
  const [step, setStep] = useState(1);
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [username, setUsername] = useState('');
  const [contactCode, setContactCode] = useState('+1');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [street, setStreet] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('CA');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // validation errors per step
  const [errors, setErrors] = useState({});

  const totalSteps = 3;

  const handleNext = () => {
    let stepErrors = {};
    if (step === 1) stepErrors = validateStep1({ first, last });
    if (step === 2) stepErrors = validateStep2({ username, contactCode, contact, address, street, postalCode, country });
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) setStep(s => Math.min(totalSteps, s + 1));
  };

  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = async e => {
    e.preventDefault();
    const stepErrors = validateStep3({ email, password, confirm });
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length) return;
    try {
      await register({
        first,
        last,
        username,
        contact: `${contactCode}${contact}`,
        address,
        street,
        postal_code: postalCode,
        email,
        password,
      });
      navigate('/login');
    } catch (err) {
      setErrors({ submit: err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>

      <div className={styles.error}>
        {Object.values(errors).length > 0 ? (
          Object.values(errors).map((msg, idx) => (
            <div key={idx} className={styles.errorLine}>
              {msg}
            </div>
          ))
        ) : (
          <div className={styles.hiddenError}>&nbsp;</div>
        )}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              className={styles.formControl}
              value={first}
              onChange={e => setFirst(e.target.value)}
              placeholder="First name"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              className={styles.formControl}
              value={last}
              onChange={e => setLast(e.target.value)}
              placeholder="Last name"
              required
            />
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className={styles.formControl}
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ flex: '0 0 30%' }}>
              <label htmlFor="contactCode">Country Code</label>
              <select
                id="contactCode"
                className={styles.formControl}
                value={contactCode}
                onChange={e => setContactCode(e.target.value)}
              >
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+49">+49</option>
                <option value="+33">+33</option>
                <option value="+61">+61</option>
                <option value="+91">+91</option>
              </select>
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label htmlFor="contact">Phone Number</label>
              <input
                id="contact"
                type="text"
                className={styles.formControl}
                value={contact}
                onChange={e => setContact(e.target.value)}
                placeholder="5551234567"
                required
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              className={styles.formControl}
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Street address"
              required
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="street">Street</label>
              <input
                id="street"
                type="text"
                className={styles.formControl}
                value={street}
                onChange={e => setStreet(e.target.value)}
                placeholder="Street name"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="country">Country</label>
              <select
                id="country"
                className={styles.formControl}
                value={country}
                onChange={e => setCountry(e.target.value)}
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="AU">Australia</option>
                <option value="IN">India</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="postalCode">Postal Code</label>
              <input
                id="postalCode"
                type="text"
                className={styles.formControl}
                value={postalCode}
                onChange={e => setPostalCode(e.target.value)}
                placeholder="ZIP / Postal code"
                required
              />
            </div>
          </div>
        </>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <>
          <div className={styles.formGroup}>
            <label htmlFor="regEmail">Email Address</label>
            <input
              id="regEmail"
              type="email"
              className={styles.formControl}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="regPassword">Password</label>
              <input
                id="regPassword"
                type="password"
                className={styles.formControl}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                className={styles.formControl}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>
        </>
      )}

      {/* Navigation Buttons */}
      <div className={styles.formRow}>
        {step > 1 && <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleBack}>Back</button>}
        {step < totalSteps && <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleNext}>Next</button>}
        {step === totalSteps && <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Create Account</button>}
      </div>

      {/* Footer */}
      <div className={styles.authFooter}>
        Already have an account? <span onClick={() => switchTab('login')} className={styles.toggleLink}>Login</span>
      </div>
    </form>
  );
}
