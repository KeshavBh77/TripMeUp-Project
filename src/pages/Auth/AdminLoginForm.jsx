// src/pages/Auth/AdminLoginForm.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import { AuthContext } from '../../context/AuthContext';

export default function AdminLoginForm({ switchTab }) {
  const { login } = useContext(AuthContext);  // <-- Use your global login function!
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/TripMeUpApp/admin-login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // Keep session cookie
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Admin login failed.");
      }


      await login(data.username, password);
      navigate('/');

    } catch (err) {
      console.error("Admin login error:", err);
      setError(err.message || "Admin login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      {/* Error Message */}
      <div className={styles.error} style={{ minHeight: '1.25rem', visibility: error ? 'visible' : 'hidden' }}>
        {error || '\u00A0'}
      </div>

      {/* Username Field */}
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
          disabled={loading}
        />
      </div>

      {/* Password Field */}
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
          disabled={loading}
        />
      </div>

      {/* Submit Button */}
      <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
        {loading ? "Logging in..." : "Admin Login"}
      </button>
    </form>
  );
}
