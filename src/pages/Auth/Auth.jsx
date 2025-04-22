// src/pages/Auth/Auth.jsx
import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaGlobeAmericas, FaUtensils, FaHotel } from "react-icons/fa";
import styles from "./Auth.module.css";
import { AuthContext } from "../../context/AuthContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegistrationForm"; // (optional if you add register later)

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const [view, setView] = useState("login");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (location.pathname === "/register") {
      setView("register");
    } else {
      setView("login");
    }
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    if (tab === "login") {
      navigate("/login");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authHero}>
        <h1>{view === "login" ? "Welcome Back!" : "Join Us!"}</h1>
        <p>
          {view === "login"
            ? "Login to your account and continue exploring amazing destinations."
            : "Create an account to discover and book restaurants and stays around the world."}
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
              view === "register" ? styles.active : ""
            }`}
            onClick={() => handleTabClick("register")}
          >
            Register
          </div>
        </div>

        {view === "login" ? (
          <LoginForm switchTab={handleTabClick} />
        ) : (
          <RegisterForm switchTab={handleTabClick} />
        )}
      </div>
    </div>
  );
}
