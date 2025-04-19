import React from 'react';
import styles from './PlaceCard.module.css';
import { FaStar, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';

const PlaceCard = ({
  image,
  title,
  rating,
  location,
  description,
  features,
  price,
  unit,
  isAccommodation = false,    // <-- new prop
  onBook                   // <-- callback when clicking Book Now
}) => (
  <div className={`${styles.card} neo-embed`} style={{ cursor: isAccommodation ? 'pointer' : 'default' }}>
    <img src={image} alt={title} className={styles.image} />
    <div className={styles.details}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.rating}>
          <FaStar className={styles.star} /> <span>{rating}</span>
        </div>
      </div>
      <div className={styles.location}>
        <FaMapMarkerAlt className={styles.icon} /> {location}
      </div>
      <p className={styles.description}>{description}</p>
      <div className={styles.features}>
        {features.map((f, i) => (
          <div key={i} className={styles.feature}>
            <i className={f.icon}></i> <span>{f.text}</span>
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        <div className={styles.price}>
          ${price} <span>per {unit}</span>
        </div>
        <button className={styles.favorite}>
          <FaHeart />
        </button>
        {isAccommodation && (
          <button
            className={styles.bookNow}
            onClick={e => {
              e.stopPropagation();
              onBook && onBook();     
            }}
          >
            Book Now
          </button>
        )}
      </div>
    </div>
  </div>
);

export default PlaceCard;
