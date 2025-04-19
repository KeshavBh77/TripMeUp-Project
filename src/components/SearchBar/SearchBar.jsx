import React, { useState } from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (onSearch) onSearch(query);
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Search for cities, restaurants, or hotels..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>
        <i className="fas fa-search" /> Search
      </button>
    </div>
  );
};

export default SearchBar;
