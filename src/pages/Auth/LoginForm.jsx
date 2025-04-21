import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Auth.module.css";

export default function LoginForm({ switchTab }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/cities");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
   <div className={`${styles.error} ${error ? styles.visible : ""}`}>
        {error || "\u00A0"}
      </div>      <div className={styles.formGroup}>
        <label htmlFor="loginEmail">Email Address</label>
        <input
          id="loginEmail"
          type="email"
          className={styles.formControl}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>

      <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
        Login
      </button>
      <div className={styles.authFooter}>
        Don't have an account?{" "}
        <span
          onClick={() => switchTab("register")}
          className={styles.toggleLink}
        >
          Register
        </span>
      </div>
    </form>
  );
}