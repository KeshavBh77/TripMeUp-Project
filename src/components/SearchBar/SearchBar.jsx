import React, { useState, useRef, useEffect, useMemo } from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ onSearch, suggestions = [], onSelect }) => {
  const [query, setQuery]       = useState('');
  const [showDropdown, setShow] = useState(false);
  const [selectedIndex, setSel] = useState(-1);
  const ref = useRef();

  // filter by label, two‑phase (prefix then contains)
  const filtered = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    const starts   = suggestions.filter(s => s.label.toLowerCase().startsWith(q));
    const contains = suggestions.filter(s =>
      !s.label.toLowerCase().startsWith(q) &&
      s.label.toLowerCase().includes(q)
    );
    return [...starts, ...contains].slice(0, 10);
  }, [query, suggestions]);

  // close on outside click
  useEffect(() => {
    const onOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShow(false);
        setSel(-1);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  // keyboard navigation
  useEffect(() => {
    const onKey = e => {
      if (!showDropdown) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSel(i => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSel(i => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        handleSelect(filtered[selectedIndex]);
      }
      if (e.key === 'Escape') {
        setShow(false);
        setSel(-1);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showDropdown, filtered, selectedIndex]);

  const handleChange = e => {
    setQuery(e.target.value);
    setShow(true);
    setSel(-1);
    onSearch?.(e.target.value);
  };
// src/components/SearchBar/SearchBar.jsx
const handleSelect = item => {
  setQuery(item.label);
  setShow(false);
  setSel(-1);
  onSelect?.(item); // Pass the full item object instead of just the label
};
  const handleSubmit = e => {
    e.preventDefault();
    onSearch?.(query);
    setShow(false);
    setSel(-1);
  };

  return (
    <div className={styles.searchBar} ref={ref}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Search for cities, restaurants, or hotels..."
          value={query}
          onChange={handleChange}
          onFocus={() => setShow(true)}
          aria-haspopup="listbox"
          aria-expanded={showDropdown}
        />
        <button type="submit">
          <i className="fas fa-search" />
          <span>Search</span>
        </button>
      </form>

      {showDropdown && (
        <div className={styles.dropdownModal}>
          {filtered.length > 0 ? (
            <ul className={styles.suggestions} role="listbox">
              {filtered.map((item, i) => (
                <li
                  key={item.label}
                  className={`${styles.suggestion} ${
                    i === selectedIndex ? styles.highlighted : ''
                  }`}
                  onClick={() => handleSelect(item)}
                  role="option"
                  aria-selected={i === selectedIndex}
                >
                  <img
                    src={item.image}
                    alt={item.label}
                    className={styles.suggestionAvatar}
                  />
                  <span className={styles.suggestionText}>{item.label}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.noResults}>No matches found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
