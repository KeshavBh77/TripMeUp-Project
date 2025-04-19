// src/components/Navbar/Navbar.jsx
import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../assets/images/logo.png'
import { FaGlobeAmericas, FaHome } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>          
      <div className={styles.logo}>
      <NavLink to="/" className={styles.logoLink}>
      <img src={logo} alt="Trip Me Up Logo" className={styles.logoImage} />
        </NavLink>
      </div>

      <div className={styles.links}>
        {user && [
          ['Home', '/'],
          ['Cities', '/cities'],
          ['Restaurants', '/restaurants'],
          ['Accommodations', '/accommodations'],
          ['My Bookings', '/bookings'],
          ['Favorites', '/favorites']
        ].map(([label, path]) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      <div className={styles.actions}>
        {!user && (
          <NavLink to="/" className={styles.homeIcon}>
            <FaHome />
          </NavLink>
        )}
        {user ? (
          <>
            <span className={styles.greeting}>Hi, {user.username}</span>
            <button className={`${styles.btn} ${styles.primary}`} onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={`${styles.btn} ${styles.outline}`}>
              Login
            </NavLink>
            <NavLink to="/register" className={`${styles.btn} ${styles.primary}`}>
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;