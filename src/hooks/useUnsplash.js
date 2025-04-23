// src/hooks/useUnsplash.js
import { useState, useEffect } from 'react';

const GENERIC_PLACE_IMAGES = [
  'https://images.unsplash.com/photo-1502920917128-1aa500764b9e?auto=format&fit=crop&w=1080',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1080',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080',
  'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=1080'
];

function getRandomFallback() {
  return GENERIC_PLACE_IMAGES[
    Math.floor(Math.random() * GENERIC_PLACE_IMAGES.length)
  ];
}

export default function useUnsplash(query) {
  const [url, setUrl] = useState(getRandomFallback());

  useEffect(() => {
    // switch to a fresh fallback immediately
    setUrl(getRandomFallback());

    if (!query) return;

    const key = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
    if (!key) {
      console.error('Missing REACT_APP_UNSPLASH_ACCESS_KEY');
      return;
    }

    let canceled = false;

    (async () => {
      try {
        // 1) targeted search: grab the regular-sized URL
        const res = await fetch(
          `https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(
            query
          )}&client_id=${key}`
        );
        const json = await res.json();
        const found = json.results?.[0]?.urls?.regular;
        if (found && !canceled) {
          setUrl(found);
          return;
        }

        // 2) if no exact match, get a random “place” regular-sized photo
        const rand = await fetch(
          `https://api.unsplash.com/photos/random?query=place&client_id=${key}`
        );
        const randJson = await rand.json();
        const randomImg = randJson.urls?.regular;
        if (randomImg && !canceled) {
          setUrl(randomImg);
        }
      } catch (err) {
        console.error('Unsplash error', err);
      }
    })();

    return () => {
      canceled = true;
    };
  }, [query]);

  return url;
}
