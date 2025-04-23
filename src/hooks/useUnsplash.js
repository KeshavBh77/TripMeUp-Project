// src/hooks/useUnsplash.js
import { useState, useEffect } from 'react';

export default function useUnsplash(query) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!query) return;

    const fetchImage = async () => {
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(query)}&client_id=${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`
        );
        const json = await res.json();
        // grab the first result’s small thumb
        const img = json.results?.[0]?.urls?.small;
        setUrl(img || null);
      } catch (err) {
        console.error('Unsplash error', err);
        setUrl(null);
      }
    };

    fetchImage();
  }, [query]);

  return url;
}
