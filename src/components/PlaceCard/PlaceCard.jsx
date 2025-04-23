// src/components/PlaceCard/PlaceCard.jsx
import React, { useState } from "react";
import styles from "./PlaceCard.module.css";
import {
  FaStar,
  FaMapMarkerAlt,
  FaHome,
  FaPhone,
  FaMailBulk,
  FaBed,
  FaHotel,
  FaUtensils,
  FaClock,
} from "react-icons/fa";
import useUnsplash from "../../hooks/useUnsplash";
import Skeleton from "../Skeleton/Skeleton";

const typeIconMap = {
  hostel: FaBed,
  hotel: FaHotel,
  apartment: FaHome,
  restaurant: FaUtensils,
};

export default function PlaceCard({
  place_id,
  name,
  contact,
  address,
  street,
  postal_code,
  email,
  rating,
  description,
  working_hours,
  isAccommodation = false,
  type,
  charge,
  amenities = [],
  onBook,
  onToggleFavorite,
  isFavorite,
  onReview,
  imageDescription = name,
}) {
  const src = useUnsplash(imageDescription);
  const [imgLoaded, setImgLoaded] = useState(false);

  const TypeIcon = type ? typeIconMap[type.toLowerCase()] || FaUtensils : null;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {!imgLoaded && <Skeleton height="200px" radius="8px" />}

        <img
          src={
            src 
          }
          alt={name}
          className={styles.image}
          style={{ display: imgLoaded ? "block" : "none" }}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgLoaded(true)}
        />
      </div>

      <div className={styles.details}>
        <div className={styles.header}>
          <h3 className={styles.title}>{name}</h3>
          <div className={styles.rating}>
            <FaStar /> <span>{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className={styles.location}>
          <FaMapMarkerAlt /> {address}, {street}, {postal_code}
        </div>

        <p className={styles.description}>{description}</p>

        {working_hours && (
          <div className={styles.feature}>
            <FaClock /> <strong>Hours:</strong> {working_hours}
          </div>
        )}

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <FaPhone /> {contact}
          </div>
          <div className={styles.metaItem}>
            <FaMailBulk /> {email}
          </div>
        </div>

        {TypeIcon && (
          <span className={styles.typeBadge}>
            <TypeIcon /> {type}
          </span>
        )}

        {charge && (
          <div className={styles.feature}>
            💰 <strong>Price:</strong> ${charge}{" "}
            {isAccommodation ? "/ night" : "/ person"}
          </div>
        )}

        {amenities.length > 0 && (
          <div className={styles.amenities}>
            <strong>Amenities</strong>
            <ul>
              {amenities.map((a, i) => (
                <li key={i} className={styles.amenityItem}>
                  {a.name} (${a.charge})
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.actions}>
          {onReview && (
            <button className={styles.reviewBtn} onClick={onReview}>
              Reviews
            </button>
          )}
          {isAccommodation && (
            <button className={styles.bookNow} onClick={onBook}>
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
