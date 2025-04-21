// src/components/CityCard/CityCard.jsx
import React from 'react';
import styles from './CityCard.module.css';
import { FaUtensils, FaHotel, FaLandmark, FaTag, FaArrowRight } from 'react-icons/fa';

// Map city type to icon component
const TypeIconMap = {
  Restaurants: FaUtensils,
  Hotels: FaHotel,
  Landmarks: FaLandmark,
  Sushi: FaUtensils,
  Ryokan: FaHotel,
  Temples: FaLandmark,
  Bistros: FaUtensils,
  Skyscrapers: FaLandmark,
  Broadway: FaTag
};

const CityCard = ({ image, title, description, types, onExplore }) => (
  <div className={`${styles.cityCard} neo-embed`} onClick={onExplore}>
    <img src={image} alt={title} className={styles.image} />
    <div className={styles.content}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <div className={styles.types}>
        {types.map(type => {
          const IconComponent = TypeIconMap[type] || FaTag;
          return (
            <span key={type} className={styles.type}>
              <IconComponent className={styles.typeIcon} /> {type}
            </span>
          );
        })}
      </div>
      <button className={styles.exploreBtn} onClick={e => { e.stopPropagation(); onExplore(); }}>
        Explore <FaArrowRight className={styles.exploreIcon} />
      </button>
    </div>
  </div>
);

export default CityCard;
