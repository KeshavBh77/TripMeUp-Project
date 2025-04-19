// src/pages/Home/Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import CityCard from '../../components/CityCard/CityCard';
import Tabs from '../../components/Tabs/Tabs';
import PlaceCard from '../../components/PlaceCard/PlaceCard';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import Footer from '../../components/Footer/Footer';
import styles from './Home.module.css';
import parisImg from '../../assets/images/paris.png';
import tokyoImg from '../../assets/images/tokyo.png';
import newyorkImg from '../../assets/images/new-york.jpg';
import restaurant from '../../assets/images/restaurant.png';
import hotel1 from '../../assets/images/hotel1.png';

const popularCities = [
  { image: parisImg, title: 'Paris', description: 'The city of love and lights.', types: ['Restaurants','Hotels','Landmarks'] },
  { image: tokyoImg, title: 'Tokyo', description: 'A vibrant mix of traditional culture and cutting-edge technology.', types: ['Sushi','Ryokan','Temples'] },
  { image: newyorkImg, title: 'New York', description: 'The city that never sleeps.', types: ['Bistros','Skyscrapers','Broadway'] }
];

const featuredPlaces = {
  restaurants: [
    {
      image: restaurant,
      title: 'La Belle Cuisine',
      rating: 4.8,
      location: 'Paris, France • French, Italian',
      description: 'An exquisite dining experience...',
      features: [{ icon: 'fas fa-clock', text: 'Open: 11 AM - 11 PM' },{ icon: 'fas fa-utensils', text: 'Fine Dining' }],
      price: 50,
      unit: 'person'
    }
  ],
  accommodations: [
    {
      image: hotel1,
      title: 'Grand Plaza Hotel',
      rating: 4.7,
      location: 'New York, USA • 5-star Hotel',
      description: 'Luxury accommodations...',
      features: [{ icon: 'fas fa-wifi', text: 'Free WiFi' },{ icon: 'fas fa-swimming-pool', text: 'Pool' }],
      price: 250,
      unit: 'night'
    }
  ]
};

const reviews = [
  { author: 'Sarah Johnson', rating: 5, date: 'May 15, 2023', content: 'Absolutely fantastic experience...' },
  { author: 'Michael Chen', rating: 4, date: 'April 28, 2023', content: 'Authentic Japanese sushi experience...' }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('restaurants');
  const [favorites, setFavorites] = useState({});
  const navigate = useNavigate();

  const toggleFavorite = id => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={styles.home}>

      <Hero />

      <div className={styles.container}>
        {/* Popular Cities */}
        <SectionTitle title="Popular Destinations" subtitle="Explore our most popular cities" />
        <div className={styles.list}>
          {popularCities.map((city, i) => (
            <div
              key={i}
              className={styles.cardWrapper}
            >
              <CityCard {...city} 
            onExplore={() => navigate(`/cities/${city.title}`)}

              />
            </div>
          ))}
        </div>

        {/* Featured */}
        <SectionTitle title="Featured Places" subtitle="Discover top-rated options" />
        <Tabs
          tabs={[
            { id: 'restaurants', label: 'Restaurants' },
            { id: 'accommodations', label: 'Accommodations' }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className={styles.list}>
          {featuredPlaces[activeTab].map((place, i) => (
            <div key={i} className={styles.cardWrapper}>
              <PlaceCard
                {...place}
                isAccommodation={activeTab === 'accommodations'}
                isFavorite={favorites[i]}
                onToggleFavorite={() => toggleFavorite(i)}
              />
            </div>
          ))}
        </div>

        {/* Reviews */}
        <SectionTitle title="Recent Reviews" subtitle="" />
        <div className={styles.list}>
          {reviews.map((rev, i) => (
            <div key={i} className={styles.cardWrapper}>
              <ReviewCard {...rev} />
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}
