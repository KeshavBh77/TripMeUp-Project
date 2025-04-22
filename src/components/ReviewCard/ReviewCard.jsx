// src/components/ReviewCard/ReviewCard.jsx
import React from "react";
import styles from "./ReviewCard.module.css";
import { FaStar } from "react-icons/fa";

const ReviewCard = ({ author, rating, date, content }) => (
    <div className={`${styles.cityCard} neo-embed`}>
        <div className={styles.reviewCard}>
            <div className={styles.header}>
                <div
                    className={styles.metaLeft}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                    <span className={styles.author}>{author}</span>
                    <span
                        className={styles.rating}
                        style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
                    >
                        {Array.from({ length: rating }).map((_, i) => (
                            <FaStar key={i} className={styles.star} />
                        ))}
                    </span>
                </div>
            </div>

            <div className={styles.contentWrapper}>
                <p className={styles.content}>{content}</p>
                <span className={styles.date}>{date}</span>
            </div>
        </div>
    </div>
);


export default ReviewCard;
