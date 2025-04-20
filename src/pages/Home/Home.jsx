// src/pages/Home/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../../components/Hero/Hero';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import CityCard from '../../components/CityCard/CityCard';
import Tabs from '../../components/Tabs/Tabs';
import PlaceCard from '../../components/PlaceCard/PlaceCard';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import styles from './Home.module.css';
import restaurant from '../../assets/images/restaurant.png';
import hotel1 from '../../assets/images/hotel1.png';

export default function Home() {
  const [activeTab, setActiveTab] = useState('restaurants');
  const [favorites, setFavorites] = useState({});
  const [cities, setCities] = useState([]);
  const [ error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleFavorite = id => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    fetch('http://localhost:8000/TripMeUpApp/')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCities(data);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Failed to fetch cities.');
      });
  }, []);

  const featuredPlaces = {
    restaurants: [
      {
        image: restaurant,
        title: 'La Belle Cuisine',
        rating: 4.8,
        location: 'Paris, France • French, Italian',
        description: 'An exquisite dining experience...',
        features: [
          { icon: 'fas fa-clock', text: 'Open: 11 AM - 11 PM' },
          { icon: 'fas fa-utensils', text: 'Fine Dining' }
        ],
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
        features: [
          { icon: 'fas fa-wifi', text: 'Free WiFi' },
          { icon: 'fas fa-swimming-pool', text: 'Pool' }
        ],
        price: 250,
        unit: 'night'
      }
    ]
  };

  const reviews = [
    {
      author: 'Sarah Johnson',
      rating: 5,
      date: 'May 15, 2023',
      content: 'Absolutely fantastic experience...'
    },
    {
      author: 'Michael Chen',
      rating: 4,
      date: 'April 28, 2023',
      content: 'Authentic Japanese sushi experience...'
    }
  ];

  return (
    <div className={styles.home}>
      <Hero cities={cities} />

      <div className={styles.container}>
        {/* Popular Cities Section */}
        <SectionTitle
          title="Popular Destinations"
          subtitle="Explore our most popular cities"
        />
        <div className={styles.list}>
          {cities.map((city, i) => (
            <div key={i} className={styles.cardWrapper}>
              <CityCard
                image={'https://via.placeholder.com/300'}
                title={city.name}
                description={city.location}
                types={['Restaurants', 'Hotels', 'Landmarks']}
                onExplore={() => navigate(`/cities/${city.name}`)}
              />
            </div>
          ))}
        </div>

        {/* Featured Places Section */}
        <SectionTitle
          title="Featured Places"
          subtitle="Discover top-rated options"
        />
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

        {/* Reviews Section */}
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
