import React from "react";
import styles from "./SectionTitle.module.css";

const SectionTitle = ({ title, subtitle }) => (
  <div className={styles.sectionTitle}>
    <h2>{title}</h2>
    <p>{subtitle}</p>
  </div>
);

export default SectionTitle;
