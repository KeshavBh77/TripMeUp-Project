import React, { useState, useEffect } from 'react';
import { useNavigate }           from 'react-router-dom';
import SectionTitle              from '../../components/SectionTitle/SectionTitle';
import CityCard                  from '../../components/CityCard/CityCard';
import styles                    from './Cities.module.css';
import parisImg                  from '../../assets/images/paris.png';
import tokyoImg                  from '../../assets/images/tokyo.png';
import newyorkImg                from '../../assets/images/new-york.jpg';

// static mapping for your images & types – you can extend this as you add more cities 
const IMAGE_MAP = {
  Paris: parisImg,
  Tokyo: tokyoImg,
  'New York': newyorkImg
};
const TYPES_MAP = {
  Paris: ['Restaurants','Hotels','Landmarks'],
  Tokyo: ['Sushi','Ryokan','Temples'],
  'New York': ['Bistros','Skyscrapers','Broadway']
};

export default function Cities() {
  const [filter, setFilter] = useState('');
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/cities/')
      .then(res => res.json())
      .then(data => {
        // data = [{ city_id, name, location }, ...]
        const prepared = data.map(c => ({
          id:          c.city_id,
          image:       IMAGE_MAP[c.name] || '',
          title:       c.name,
          description: c.location,
          types:       TYPES_MAP[c.name] || []
        }));
        setCities(prepared);
      })
      .catch(console.error);
  }, []);

  const filtered = cities.filter(c =>
    c.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <SectionTitle
        title="Popular Cities"
        subtitle="Browse our selection of the most visited cities"
      />

      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search cities…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.list}>
        {filtered.map(city => (
          <div
            key={city.id}
            className={styles.cardWrapper}
            onClick={() => navigate(`/cities/${city.id}`)}
          >
            <CityCard {...city}/>
          </div>
        ))}
      </div>
    </div>
  );
}
