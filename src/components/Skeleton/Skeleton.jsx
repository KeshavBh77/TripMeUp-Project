// src/components/Loading/Skeleton.jsx
import React from 'react';
import styles from './Skeleton.module.css';

const Skeleton = ({ height = "1rem", width = "100%", radius = "8px" }) => (
  <div
    className={styles.skeleton}
    style={{ height, width, borderRadius: radius }}
  />
);

export default Skeleton;
