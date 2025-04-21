import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Auth.module.css";

export default function LoginForm({ switchTab }) {
  const [email, setEmail] = useState("");
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
      await new Promise((r) => setTimeout(r, 1000)); // Simulate delay
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
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
        <label htmlFor="loginEmail">Email Address</label>
        <input
          id="loginEmail"
          type="email"
          className={styles.formControl}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
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
