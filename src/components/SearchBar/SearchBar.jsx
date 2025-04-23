// src/components/SearchBar/SearchBar.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import useUnsplash from '../../hooks/useUnsplash';
import styles from './SearchBar.module.css';

// individual suggestion with dynamic Unsplash image
function Suggestion({ item, highlighted, onSelect }) {
  // fetch image for suggestion label or provided imageDescription
  const src = useUnsplash(item.imageDescription || item.label);

  return (
    <li
      className={`${styles.suggestion} ${highlighted ? styles.highlighted : ''}`}
      onClick={() => onSelect(item)}
      role="option"
      aria-selected={highlighted}
    >
      <img
        src={src || item.image || 'https://via.placeholder.com/40'}
        alt={item.label}
        className={styles.suggestionAvatar}
      />
      <span className={styles.suggestionText}>{item.label}</span>
    </li>
  );
}

export default function SearchBar({ onSearch, suggestions = [], onSelect }) {
  const [query, setQuery] = useState('');
  const [showDropdown, setShow] = useState(false);
  const [selectedIndex, setSel] = useState(-1);
  const ref = useRef();

  const filtered = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    const starts = suggestions.filter(s => s.label.toLowerCase().startsWith(q));
    const contains = suggestions.filter(
      s => !s.label.toLowerCase().startsWith(q) && s.label.toLowerCase().includes(q)
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

  // keyboard nav
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

  const handleSelect = item => {
    setQuery(item.label);
    setShow(false);
    setSel(-1);
    onSelect?.(item);
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
        <div className={styles.dropdownModal} role="listbox">
          {query.trim() === '' ? (
            <div className={styles.noResults}>Start typing to search...</div>
          ) : filtered.length > 0 ? (
            <ul className={styles.suggestions}>
              {filtered.map((item, i) => (
                <Suggestion
                  key={item.label}
                  item={item}
                  highlighted={i === selectedIndex}
                  onSelect={handleSelect}
                />
              ))}
            </ul>
          ) : (
            <div className={styles.noResults}>No matches found</div>
          )}
        </div>
      )}
    </div>
  );
}

