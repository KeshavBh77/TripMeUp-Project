import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Cities.module.css';
import SearchBar from '../../components/SearchBar/SearchBar';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import CityCard from '../../components/CityCard/CityCard';


export default function Cities() {
  const [filter, setFilter] = useState("");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const cityCardsRef = useRef({});

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('http://localhost:8000/TripMeUpApp/city/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const transformedData = data.map(city => ({
          title: city.name,
          description: city.location,
          types: city.place_types || [],
          image: city.image_url || 'default-image.jpg',
          original: city
        }));

        setCities(transformedData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const filtered = cities.filter(c =>
    c.title.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSearchSelect = (item) => {
    setFilter(item.label);
    const el = cityCardsRef.current[item.label];
    if (!el) return;

    const headerHeight = 240;
    const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    el.classList.add(styles.highlight);
    setTimeout(() => el.classList.remove(styles.highlight), 2000);
  };

  if (loading) {
    return <div className={styles.loading}>Loading cities...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.overlay} />
        <div className={styles.content}>
          <h1>Explore World Cities</h1>
          <p>Discover the most exciting destinations around the globe</p>
          <div className={styles.searchWrapper}>
            <SearchBar
              suggestions={cities.map(c => ({
                label: c.title,
                image: c.image,
                original: c 
              }))}
              onSearch={setFilter}
              onSelect={handleSearchSelect}
            />
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <SectionTitle
          title="Popular Cities"
          subtitle="Browse our selection of the most visited cities by travelers"
        />

        <div className={styles.list}>
          {filtered.map((city) => (
            <div
              key={city.title}
              className={styles.cardWrapper}
              onClick={() => navigate(`/cities/${city.original.name}`)}
              ref={el => cityCardsRef.current[city.title] = el}
            >
              <CityCard 
                title={city.title}
                description={city.description}
                types={city.types}
                image={city.image}
                onExplore={() => navigate(`/cities/${city.original.name}`)}
              />
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}
