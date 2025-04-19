// src/pages/Cities/Cities.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Cities.module.css';
import SearchBar from '../../components/SearchBar/SearchBar';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import CityCard from '../../components/CityCard/CityCard';
import parisImg from '../../assets/images/paris.png';
import tokyoImg from '../../assets/images/tokyo.png';
import newyorkImg from '../../assets/images/new-york.jpg';
import Footer from '../../components/Footer/Footer';

const allCities = [
  { image: parisImg, title: 'Paris', description: 'The city of love and lights.', types: ['Restaurants','Hotels','Landmarks'] },
  { image: tokyoImg, title: 'Tokyo', description: 'A vibrant mix of traditional culture and cutting-edge technology.', types: ['Sushi','Ryokan','Temples'] },
  { image: newyorkImg, title: 'New York', description: 'The city that never sleeps.', types: ['Bistros','Skyscrapers','Broadway'] }
];

const Cities = () => {
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();
  const filtered = allCities.filter(c => c.title.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.overlay} />
        <div className={styles.content}>
          <h1>Explore World Cities</h1>
          <p>Discover the most exciting destinations around the globe</p>
          <div className={styles.searchWrapper}>
            <SearchBar onSearch={setFilter} />
          </div>
        </div>
      </section>
      <div className={styles.container}>
        <SectionTitle title="Popular Cities" subtitle="Browse our selection of the most visited cities by travelers" />
        <div className={styles.list}>
          {filtered.map(city => (
            <div
              key={city.title}
              className={styles.cardWrapper}
              onClick={() => navigate(`/cities/${city.title}`)}
            >
              <CityCard {...city} 
              
              onExplore={() => navigate(`/cities/${city.title}`)}

              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Cities;