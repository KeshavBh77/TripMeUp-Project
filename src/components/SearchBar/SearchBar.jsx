// src/components/SearchBar/SearchBar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <== Add this line
import styles from "./SearchBar.module.css";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate(); // <== use navigate hook

  const handleSearch = () => {
    if (query.trim()) {
      const formattedQuery = query.trim().toLowerCase();
      navigate(`/cities/${formattedQuery}`); // <== this matches your route in App.jsx
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Search for cities, restaurants, or hotels..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress} // <== Added this to listen for Enter key
      />
      <button onClick={handleSearch}>
        <i className="fas fa-search" /> Search
      </button>
    </div>
  );
};

export default SearchBar;
