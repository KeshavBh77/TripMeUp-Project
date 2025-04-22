import React from "react";
import styles from "./PlaceCard.module.css";
import {
  FaStar,
  FaMapMarkerAlt,
  FaBed,
  FaHotel,
  FaHome,
  FaUtensils,
  FaClock,
  FaWifi,
  FaSwimmingPool,
  FaComments
} from "react-icons/fa";

const typeIconMap = {
  hostel: FaHome,
  hotel: FaHotel,
  bed: FaBed,
  apartment: FaHome,
  restaurant: FaUtensils,
};

const PlaceCard = ({
  place_id,            // id for routing / reviews
  name,
  contact,
  address,
  street,
  postal_code,
  email,
  rating = 0,
  description,
  working_hours,
  isAccommodation = false,
  type,
  charge,
  amenities = [],
  onBook,
  onReview,            // ← new callback
}) => {
  const TypeIcon = type
    ? (typeIconMap[type.toLowerCase()] || FaHome)
    : null;

  return (
    <div
      className={styles.card}
      onClick={isAccommodation ? onBook : undefined}
    >
      <div className={styles.imageWrapper}>
        <img
          src={`https://source.unsplash.com/400x300/?${
            isAccommodation ? "hotel" : "restaurant"
          }`}
          alt={name}
          className={styles.image}
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
          <FaMapMarkerAlt />
          <span>{`${address}, ${street}, ${postal_code}`}</span>
        </div>

        <p className={styles.description}>{description}</p>

        {working_hours && (
          <div className={styles.feature}>
            <FaClock /> <strong>Hours:</strong> {working_hours}
          </div>
        )}

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <FaUtensils /> <span>{contact}</span>
          </div>
          <div className={styles.metaItem}>
            <FaWifi /> <span>{email}</span>
          </div>
        </div>

        {TypeIcon && (
          <span className={styles.typeBadge}>
            <TypeIcon className={styles.typeIcon} /> {type}
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
                  {a.name}{" "}
                  <span className={styles.amenityCharge}>
                    (${a.charge})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.actions}>
          {isAccommodation && (
            <button
              className={styles.bookNow}
              onClick={(e) => {
                e.stopPropagation();
                onBook && onBook(place_id);
              }}
            >
              Book Now
            </button>
          )}
          { onReview && (
            <button
              className={styles.reviewBtn}
              onClick={(e) => {
                e.stopPropagation();
                onReview && onReview(place_id);
              }}
            >
              <FaComments /> Read Reviews
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
