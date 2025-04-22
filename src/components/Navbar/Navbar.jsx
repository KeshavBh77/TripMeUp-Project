import React, { useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Navbar.module.css";
import logo from "../../assets/images/logo.png";
import { FaHome } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/TripMeUpApp/check-admin/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",  // Important: needed for session
        });

        const data = await res.json();
        console.log("Admin check result:", data);

        if (res.ok) {
          setIsAdmin(data.admin);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Error checking admin:", err);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Detect if on login/register page
  const onAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      {/* Logo */}
      <div className={styles.logo}>
        <NavLink to="/" className={styles.logoLink}>
          <img src={logo} alt="Trip Me Up Logo" className={styles.logoImage} />
        </NavLink>
      </div>

      {/* Navigation Links */}
      {user && (
        <div className={styles.links}>
          <NavLink to="/" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>Home</NavLink>
          <NavLink to="/cities" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>Cities</NavLink>
          <NavLink to="/restaurants" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>Restaurants</NavLink>
          <NavLink to="/accommodations" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>Accommodations</NavLink>
          <NavLink to="/bookings" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>My Bookings</NavLink>

          {/* Only show if Admin */}
          {isAdmin && (
            <NavLink to="/admin/dashboard" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>
              Manage All Bookings
            </NavLink>
          )}
        </div>
      )}

      {/* Right Side Actions */}
      <div className={styles.actions}>
        <NavLink to="/" className={styles.homeIcon}>
          <FaHome />
        </NavLink>

        {user ? (
          <>
            <span className={styles.greeting}>Hi, {user.username}</span>
            <button
              onClick={() => setShowConfirm(true)}
              className={`${styles.btn} ${styles.primary}`}
            >
              Logout
            </button>
          </>
        ) : (
          !onAuthPage && (
            <>
              <NavLink to="/login" className={`${styles.btn} ${styles.outline}`}>
                Login
              </NavLink>
              <NavLink to="/register" className={`${styles.btn} ${styles.primary}`}>
                Sign Up
              </NavLink>
            </>
          )
        )}
      </div>

      {/* Logout Confirm */}
      {showConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Are you sure you want to logout?</h3>
            <div className={styles.modalActions}>
              <button
                className={`${styles.btn} ${styles.outline}`}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className={`${styles.btn} ${styles.primary}`}
                onClick={() => {
                  logout();
                  setShowConfirm(false);
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 3000);
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && <div className={styles.toast}>You've been logged out.</div>}
    </nav>
  );
};

export default Navbar;
