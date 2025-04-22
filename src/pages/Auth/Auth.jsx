// src/pages/Auth/Auth.jsx
import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaGlobeAmericas, FaUtensils, FaHotel } from "react-icons/fa";
import styles from "./Auth.module.css";
import { AuthContext } from "../../context/AuthContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegistrationForm";
import AdminLoginForm from "./AdminLoginForm";

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [view, setView] = useState("login");

  // Redirect away if already logged in as user or admin
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Sync tab with URL
  useEffect(() => {
    switch (location.pathname) {
      case "/register":
        setView("register");
        break;
      case "/admin-login":
        setView("admin");
        break;
      default:
        setView("login");
    }
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    switch (tab) {
      case "login":
        navigate("/login");
        break;
      case "register":
        navigate("/register");
        break;
      case "admin":
        navigate("/admin-login");
        break;
      default:
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authHero}>
        <h1>
          {view === "login"
            ? "Welcome Back!"
            : view === "register"
            ? "Join Us!"
            : "Admin Login"}
        </h1>
        <p>
          {view === "login"
            ? "Login to your account and continue exploring amazing destinations."
            : view === "register"
            ? "Create an account to discover and book restaurants and stays around the world."
            : "Administrators, please sign in below."}
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
            className={`${styles.authTab} ${
              view === "login" ? styles.active : ""
            }`}
            onClick={() => handleTabClick("login")}
          >
            Login
          </div>
          <div
            className={`${styles.authTab} ${
              view === "admin" ? styles.active : ""
            }`}
            onClick={() => handleTabClick("admin")}
          >
            Admin
          </div>
          <div
            className={`${styles.authTab} ${
              view === "register" ? styles.active : ""
            }`}
            onClick={() => handleTabClick("register")}
          >
            Register
          </div>
        </div>

        {view === "login" && <LoginForm switchTab={handleTabClick} />}
        {view === "admin" && <AdminLoginForm switchTab={handleTabClick} />}
        {view === "register" && <RegisterForm switchTab={handleTabClick} />}
      </div>
    </div>
  );
}
