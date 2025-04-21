import React from "react";
import { useNavigate } from "react-router-dom";
import styles from ".//NotFound404.module.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.notFound}>
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
};

export default NotFound;
