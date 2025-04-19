// src/pages/Auth/Auth.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaGlobeAmericas,
  FaUtensils,
  FaHotel,
} from 'react-icons/fa';
import styles from './Auth.module.css';
import { AuthContext } from '../../context/AuthContext';

export default function Auth() {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [view, setView] = useState('login');

  // login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // register form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const switchTab = (tab) => {
    setError(null);
    setView(tab);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginEmail, loginPassword);
      navigate('/cities');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await register(regEmail, regPassword, { firstName, lastName });
      navigate('/cities');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authHero}>
        <h1>{view === 'login' ? 'Welcome Back!' : 'Join Us!'}</h1>
        <p>
          {view === 'login'
            ? 'Login to your account and continue exploring amazing destinations.'
            : 'Create an account to discover and book restaurants and stays around the world.'}
        </p>
        <div className={styles.authFeatures}>
          <div className={styles.authFeature}>
            <FaGlobeAmericas />
            <span>Discover destinations</span>
          </div>
          <div className={styles.authFeature}>
            <FaUtensils />
            <span>Book top-rated restaurants</span>
          </div>
          <div className={styles.authFeature}>
            <FaHotel />
            <span>Find perfect accommodations</span>
          </div>
        </div>
      </div>

      <div className={styles.authContent}>
        <div className={styles.authTabs}>
          <div
            className={`${styles.authTab} ${view === 'login' ? styles.active : ''}`}
            onClick={() => switchTab('login')}
          >
            Login
          </div>
          <div
            className={`${styles.authTab} ${view === 'register' ? styles.active : ''}`}
            onClick={() => switchTab('register')}
          >
            Register
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.authForm} style={{ display: view === 'login' ? 'block' : 'none' }}>
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label htmlFor="loginEmail">Email Address</label>
              <input
                id="loginEmail"
                type="email"
                className={styles.formControl}
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="loginPassword">Password</label>
              <input
                id="loginPassword"
                type="password"
                className={styles.formControl}
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className={styles.forgotPassword}>
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Login</button>
            <div className={styles.authFooter}>
              Don't have an account?{' '}
              <span onClick={() => switchTab('register')} className={styles.toggleLink}>
                Register
              </span>
            </div>
          </form>
        </div>

        <div className={styles.authForm} style={{ display: view === 'register' ? 'block' : 'none' }}>
          <form onSubmit={handleRegister}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  className={styles.formControl}
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
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
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="regEmail">Email Address</label>
              <input
                id="regEmail"
                type="email"
                className={styles.formControl}
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="regPassword">Password</label>
              <input
                id="regPassword"
                type="password"
                className={styles.formControl}
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
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
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Create Account</button>
            <div className={styles.authFooter}>
              Already have an account?{' '}
              <span onClick={() => switchTab('login')} className={styles.toggleLink}>
                Login
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
