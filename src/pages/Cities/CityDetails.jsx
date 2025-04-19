// src/pages/CityDetail/CityDetail.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import PlaceCard from '../../components/PlaceCard/PlaceCard';
import CityCard from '../../components/CityCard/CityCard';
import BookingModal from '../../components/BookingModal/BookingModal';
import styles from './CityDetail.module.css';
import {
  FaLandmark,
  FaLanguage,
  FaMoneyBillWave,
  FaPlane,
  FaSubway
} from 'react-icons/fa';

const details = {
  Paris: {
    about: `Paris, France's capital, is a major European city and a global center for art, fashion, gastronomy and culture...`,
    attractions: [
      'Eiffel Tower',
      'Louvre Museum',
      'Notre-Dame Cathedral',
      'Champs-Élysées',
      'Montmartre & Sacré-Cœur'
    ],
    facts: [
      { icon: FaLanguage, label: 'Language: French' },
      { icon: FaMoneyBillWave, label: 'Currency: Euro (€)' },
      { icon: FaPlane, label: 'Airport: CDG, ORY' },
      { icon: FaSubway, label: 'Metro: 16 lines' }
    ],
    restaurants: [
      {
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        title: 'Le Meurice',
        rating: 4.8,
        location: 'Paris, France • French',
        description: 'Classic French fine dining in a historic palace setting.',
        features: [
          { icon: 'fas fa-clock', text: 'Open: 12:00 PM - 10:00 PM' },
          { icon: 'fas fa-utensils', text: 'Fine Dining' }
        ],
        price: 60,
        unit: 'person'
      },
      {
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
        title: 'Sakura Sushi Bar',
        rating: 4.9,
        location: 'Paris, France • Japanese, Sushi',
        description: 'Authentic sushi experience with premium imports.',
        features: [
          { icon: 'fas fa-fish', text: 'Fresh Seafood' },
          { icon: 'fas fa-utensils', text: 'Sushi Omakase' }
        ],
        price: 40,
        unit: 'person'
      }
    ],
    accommodations: [
      {
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        title: 'Hotel Le Bristol',
        rating: 4.7,
        location: 'Paris, France • 5-star Hotel',
        description: 'Luxurious rooms with Michelin-starred dining.',
        features: [
          { icon: 'fas fa-wifi', text: 'Free WiFi' },
          { icon: 'fas fa-swimming-pool', text: 'Indoor Pool' }
        ],
        price: 450,
        unit: 'night'
      },
      {
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        title: 'Parisian Boutique',
        rating: 4.4,
        location: 'Paris, France • Boutique Hotel',
        description: 'Charming boutique experience in the heart of the city.',
        features: [
          { icon: 'fas fa-parking', text: 'Valet Parking' },
          { icon: 'fas fa-spa', text: 'Spa Services' }
        ],
        price: 220,
        unit: 'night'
      }
    ]
  }
};

const CityDetail = () => {
  const { title } = useParams();
  const cityKey = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
  const data = details[cityKey] || { about: '', attractions: [], facts: [], restaurants: [], accommodations: [] };
  const [view, setView] = useState('restaurants');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleBook = (place) => {
    setSelectedPlace(place);
    setBookingOpen(true);
  };

  return (
    <div>
      <section className={styles.heroDetail}>
        <div className={styles.overlayDetail} />
        <div className={styles.contentDetail}>
          <h1>{cityKey}, France</h1>
          <p>The city of love and lights, famous for its art, fashion, and cuisine</p>
        </div>
      </section>

      <div className={styles.containerDetail}>
        <SectionTitle title={`About ${cityKey}`} subtitle={`Discover the magic of ${cityKey}`} />
        <div className={styles.detailGrid}>
          <div className={styles.textBlock}>
            <p>{data.about}</p>
            <div className={styles.facts}>
              {data.facts.map((f, i) => (
                <div key={i} className={styles.fact}>
                  <f.icon /> {f.label}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.attractionBlock}>
            <h3>Top Attractions</h3>
            <ul>
              {data.attractions.map((a, i) => (
                <li key={i} className={styles.attractionItem}>
                  <FaLandmark className={styles.attractionIcon} /> {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button
            className={`${styles.toggleBtn} ${view === 'restaurants' ? styles.active : ''}`}
            onClick={() => setView('restaurants')}
          >
            Restaurants
          </button>
          <button
            className={`${styles.toggleBtn} ${view === 'accommodations' ? styles.active : ''}`}
            onClick={() => setView('accommodations')}
          >
            Accommodations
          </button>
        </div>

        <div className={styles.placeGrid}>
          {(view === 'restaurants' ? data.restaurants : data.accommodations).map((item, i) => (
            <div key={i} className={styles.cardWrapper}>
              <PlaceCard
                {...item}
                isAccommodation={view === 'accommodations'}
                onBook={view === 'accommodations' ? () => handleBook(item) : undefined}
              />
            </div>
          ))}
        </div>

        <BookingModal
          show={bookingOpen}
          place={selectedPlace}
          onClose={() => setBookingOpen(false)}
          onSubmit={({ place, dates, guests }) =>
            console.log('Booking confirmed for', place, dates, guests)
          }
        />
      </div>
    </div>
  );
};

export default CityDetail;
