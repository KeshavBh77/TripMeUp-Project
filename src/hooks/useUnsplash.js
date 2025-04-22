// src/hooks/useUnsplash.js
import { useState, useEffect } from 'react';

// Unsplash key from environment variables
const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

/**
 * Custom hook to fetch a relevant image URL from Unsplash.
 * Attempts multiple query strategies to improve relevance.
 * @param {string} keyword - Primary term to search (e.g. place name).
 * @param {string} [type] - Optional type ("restaurant", "hotel") to refine query.
 * @returns {string|null} - URL of fetched image or null if none.
 */
export default function useUnsplash(keyword, type = '') {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!keyword || !UNSPLASH_ACCESS_KEY) {
      setUrl(null);
      return;
    }

    const queries = [];
    if (type) queries.push(`${type} ${keyword}`);
    queries.push(keyword);
    if (type) queries.push(type);

    let canceled = false;

    (async () => {
      for (const q of queries) {
        try {
          const res = await fetch(
            `https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(q)}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape&per_page=1`
          );
          const json = await res.json();
          const first = json.results && json.results[0];
          if (first && first.urls && first.urls.small) {
            if (!canceled) setUrl(first.urls.small);
            return;
          }
        } catch (e) {
          console.warn(`Unsplash failed for '${q}':`, e);
        }
      }
      if (!canceled) setUrl(null);
    })();

    return () => { canceled = true; };
  }, [keyword, type]);

  return url;
}