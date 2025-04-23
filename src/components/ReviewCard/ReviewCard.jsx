import React from "react";
import styles from "./ReviewCard.module.css";
import { FaStar } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { FaUser } from "react-icons/fa";

const ReviewCard = ({ author, placeName, rating, date, content }) => (
    <div className={`${styles.cityCard} neo-embed`}>
        <div className={styles.reviewCard}>
            <div className={styles.header}>
                <div className={styles.left}>
                    <FaUser className={styles.icon} />
                    <span className={styles.author}>{author}</span>
                </div>
                {placeName && (
                    <div className={styles.right}>
                        <HiLocationMarker className={styles.icon} />
                        <span className={styles.placeName}>{placeName}</span>
                    </div>
                )}
            </div>

            <div className={styles.contentWrapper}>
                <p className={styles.content}>"{content}"</p>
                <div className={styles.footer}>
                    <div className={styles.rating}>
                        {Array.from({ length: rating }).map((_, i) => (
                            <FaStar key={i} className={styles.star} />
                        ))}
                    </div>
                    <span className={styles.date}>{date}</span>
                </div>
            </div>
        </div>
    </div>
);

export default ReviewCard;
