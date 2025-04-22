// src/pages/Auth/AdminLoginForm.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import { AuthContext } from '../../context/AuthContext';

export default function AdminLoginForm({ switchTab }) {
  const { loginAdmin } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await loginAdmin(username, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      {/* always‑there error container */}
      <div className={styles.error} style={{ minHeight: '1.25rem', visibility: error ? 'visible' : 'hidden' }}>
        {error || '\u00A0'}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="admin-username">Username</label>
        <input
          id="admin-username"
          type="text"
          className={styles.formControl}
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Admin username"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          type="password"
          className={styles.formControl}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
      </div>

      <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
        Admin Login
      </button>

      <div className={styles.authFooter}>
        Back to{' '}
        <span onClick={() => switchTab('login')} className={styles.toggleLink}>
          User Login
        </span>
      </div>
    </form>
  );
}
