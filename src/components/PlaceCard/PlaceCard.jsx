import React from "react";
import styles from "./PlaceCard.module.css";
import { FaStar, FaMapMarkerAlt, FaHeart } from "react-icons/fa";

const PlaceCard = ({
    name,
    contact,
    address,
    street,
    postal_code,
    email,
    rating,
    description,
    isAccommodation = false,
    type,
    charge,
    amenities = [],
    onBook,
}) => (
    <div
        className={`${styles.card} neo-embed`}
        style={{ cursor: isAccommodation ? "pointer" : "default" }}
    >
        <img
            src={`https://source.unsplash.com/random/400x300/?hotel,${name}`}
            alt={name}
            className={styles.image}
        />
        <div className={styles.details}>
            <div className={styles.header}>
                <h3 className={styles.title}>{name}</h3>
                <div className={styles.rating}>
                    <FaStar className={styles.star} /> <span>{rating}</span>
                </div>
            </div>

            <div className={styles.location}>
                <FaMapMarkerAlt className={styles.icon} /> {address}, {street}, {postal_code}
            </div>

            <p className={styles.description}>{description}</p>

            <div className={styles.features}>
                <div className={styles.feature}>
                    📞 <span>{contact}</span>
                </div>
                <div className={styles.feature}>
                    📧 <span>{email}</span>
                </div>
                {type && (
                    <div className={styles.feature}>
                        🏨 <strong>Type:</strong> {type}
                    </div>
                )}
                {charge && (
                    <div className={styles.feature}>
                        💰 <strong>Charge:</strong> ${charge}
                    </div>
                )}
            </div>

            {amenities.length > 0 && (
                <div className={styles.amenities}>
                    <strong>Amenities:</strong>
                    <ul>
                        {amenities.map((a, index) => (
                            <li key={index}>
                                {a.name} – ${a.charge} ({a.timings})
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className={styles.actions}>
                <div className={styles.price}>
                    ${charge || rating * 20} <span>per night</span>
                </div>
                <button className={styles.favorite}>
                    <FaHeart />
                </button>
                {isAccommodation && (
                    <button
                        className={styles.bookNow}
                        onClick={(e) => {
                            e.stopPropagation();
                            onBook && onBook();
                        }}
                    >
                        Book Now
                    </button>
                )}
            </div>
        </div>
    </div>
);

export default PlaceCard;
