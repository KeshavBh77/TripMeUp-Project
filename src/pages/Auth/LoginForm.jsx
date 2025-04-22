// src/pages/Auth/LoginForm.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Auth.module.css";


export default function LoginForm({ switchTab }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      <div className={`${styles.error} ${error ? styles.visible : ""}`}>
        {error || "\u00A0"}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="loginUsername">Username</label>
        <input
          id="loginUsername"
          type="text"
          className={styles.formControl}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
          disabled={loading}
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
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        className={`${styles.btn} ${styles.btnPrimary} ${styles.loginBtn}`}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className={styles.spinner}></span>
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </button>

      <div className={styles.authFooter}>
        Don't have an account?{" "}
        <span
          onClick={() => !loading && switchTab("register")}
          className={styles.toggleLink}
        >
          Register
        </span>
      </div>
    </form>
  );
}
