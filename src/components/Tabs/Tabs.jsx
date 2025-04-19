import React from 'react';
import styles from './Tabs.module.css';

const Tabs = ({ tabs, activeTab, onTabChange }) => (
  <div className={styles.tabs}>
    {tabs.map(tab => (
      <div
        key={tab.id}
        className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
        onClick={() => onTabChange(tab.id)}
      >
        {tab.label}
      </div>
    ))}
  </div>
);

export default Tabs;
