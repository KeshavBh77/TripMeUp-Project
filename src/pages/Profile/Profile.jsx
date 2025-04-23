// src/pages/Profile/Profile.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className={styles.error}>
        You must be logged in to view your profile.
      </div>
    );
  }

  const {
    username,
    email,
    first,
    last,
    contact,
    address,
    street,
    postal_code
  } = user;

  // Compute initials for avatar
  const initials = `${first ? first.charAt(0) : username.charAt(0)}${last ? last.charAt(0) : ''}`.toUpperCase();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>My Profile</h1>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.nameGroup}>
            <h2 className={styles.name}>{first && last ? `${first} ${last}` : username}</h2>
            <span className={styles.usern}>@{username}</span>
          </div>
        </div>

        <dl className={styles.details}>
          <div className={styles.row}>
            <dt>Email</dt>
            <dd>{email}</dd>
          </div>
          {contact && (
            <div className={styles.row}>
              <dt>Contact</dt>
              <dd>{contact}</dd>
            </div>
          )}
          {address && (
            <div className={styles.row}>
              <dt>Address</dt>
              <dd>{address}</dd>
            </div>
          )}
          {(street || postal_code) && (
            <div className={styles.row}>
              <dt>Location</dt>
              <dd>{[street, postal_code].filter(Boolean).join(', ')}</dd>
            </div>
          )}
        </dl>

        <button
          className={styles.logoutBtn}
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}