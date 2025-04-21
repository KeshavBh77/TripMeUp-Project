// src/pages/Restaurants/Restaurants.jsx
import React, { useState, useEffect } from "react";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import PlaceCard from "../../components/PlaceCard/PlaceCard";
import styles from "./Restaurants.module.css";

export default function Restaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch("http://localhost:8000/TripMeUpApp/restaurants/");
                const data = await response.json();
                setRestaurants(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching restaurant data:", error);
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    return (
        <div>
            <section className={styles.hero}>
                <div className={styles.overlay} />
                <div className={styles.content}>
                    <h1>Discover World-Class Dining</h1>
                    <p>
                        Find and book the best restaurants for an unforgettable culinary
                        experience
                    </p>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            placeholder="Search for restaurants, cuisines, or locations..."
                        />
                        <button>
                            <i className="fas fa-search" /> Search
                        </button>
                    </div>
                </div>
            </section>

            <div className={styles.container}>
                <SectionTitle
                    title="Featured Restaurants"
                    subtitle="Top-rated dining experiences from around the world"
                />

                <div className={styles.placeGrid}>
                    {loading ? (
                        <p>Loading restaurants...</p>
                    ) : (
                        restaurants.map((item, i) => (
                            <div key={i} className={styles.cardWrapper}>
                                <PlaceCard
                                    key={i}
                                    image={item.place.image} // Assuming `image` is a field in Place model or placeholder
                                    name={item.place.name}
                                    contact={item.place.contact}
                                    address={item.place.address}
                                    street={item.place.street}
                                    postal_code={item.place.postal_code}
                                    email={item.place.email}
                                    rating={item.place.rating}
                                    description={item.place.description}
                                    working_hours={item.working_hours} // Displaying the working hours
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
