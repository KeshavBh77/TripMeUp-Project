import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Cities.module.css';
import SearchBar from '../../components/SearchBar/SearchBar';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import CityCard from '../../components/CityCard/CityCard';
import Skeleton from '../../components/Skeleton/Skeleton';

export default function Cities() {
  const [filter, setFilter] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const cardRefs = useRef({});

  useEffect(() => {
    const fetchCities = async () => {
      try {
        await new Promise(r => setTimeout(r, 1500)); // simulate delay
        const res = await fetch('http://localhost:8000/TripMeUpApp/city/');
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setCities(
          data.map(c => ({
            title: c.name,
            description: c.location,
            types: c.place_types || [],
            image: c.image_url || 'default-image.jpg',
            original: c,
          }))
        );
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  // Called when typing in the search bar
  const handleSearch = txt => {
    setFilter(txt);
    // clearing input should reset selection
    if (txt.trim() === '') setSelectedCity(null);
  };

  // Called when selecting from suggestions
  const handleSelect = item => {
    setSelectedCity(item.label);

    // scroll into view
    const el = cardRefs.current[item.label];
    if (!el) return;
    const offset = 240;
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });

    el.classList.add(styles.highlight);
    setTimeout(() => el.classList.remove(styles.highlight), 2000);
  };

  // decide what to render
  const filtered = cities.filter(c =>
    c.title.toLowerCase().includes(filter.toLowerCase())
  );
  const display = selectedCity
    ? cities.filter(c => c.title === selectedCity)
    : filtered;

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.overlay} />
        <div className={styles.content}>
          <h1>Explore World Cities</h1>
          <p>Discover the most exciting destinations</p>
          <div className={styles.searchWrapper}>
            <SearchBar
              value={filter}
              suggestions={cities.map(c => ({
                label: c.title,
                image: c.image,
                original: c,
              }))}
              onSearch={handleSearch}
              onSelect={handleSelect}
              placeholder="Search cities..."
              onClear={() => {
                setFilter('');
                setSelectedCity(null);
              }}
            />
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <SectionTitle
          title="Popular Cities"
          subtitle={
            selectedCity
              ? `Showing: ${selectedCity}`
              : 'Browse our top picks'
          }
        />

        <div className={styles.list}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.cardWrapper}>
                <Skeleton height="300px" radius="16px" />
              </div>
            ))
          ) : error ? (
            <div className={styles.error}>Error: {error}</div>
          ) : display.length > 0 ? (
            display.map(city => (
              <div
                key={city.title}
                ref={el => (cardRefs.current[city.title] = el)}
                className={styles.cardWrapper}
                onClick={() =>
                  navigate(`/cities/${city.original.name}`)
                }
              >
                <CityCard
                  title={city.title}
                  description={city.description}
                  types={city.types}
                  image={city.image}
                  onExplore={() =>
                    navigate(`/cities/${city.original.name}`)
                  }
                />
              </div>
            ))
          ) : (
            <div className={styles.error}>
              No cities match "{filter}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
