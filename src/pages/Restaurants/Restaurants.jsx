import React, { useState, useEffect } from "react";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import PlaceCard from "../../components/PlaceCard/PlaceCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import Skeleton from "../../components/Skeleton/Skeleton";
import styles from "./Restaurants.module.css";
import {useNavigate}  from "react-router-dom";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        await new Promise((res) => setTimeout(res, 1500)); // simulate delay
        const response = await fetch("http://localhost:8000/TripMeUpApp/restaurants/");
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      } finally {
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
          <SearchBar />
        </div>
      </section>

      <div className={styles.container}>
        <SectionTitle
          title="Featured Restaurants"
          subtitle="Top-rated dining experiences from around the world"
        />

        <div className={styles.placeGrid}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.cardWrapper}>
                <Skeleton height="320px" radius="16px" />
              </div>
            ))
          ) : (
            restaurants.map((item, i) => (
              <div key={i} className={styles.cardWrapper}>
                <PlaceCard
                  image={item.place.image || "https://via.placeholder.com/300"}
                  name={item.place.name}
                  contact={item.place.contact}
                  address={item.place.address}
                  street={item.place.street}
                  postal_code={item.place.postal_code}
                  email={item.place.email}
                  rating={item.place.rating}
                  description={item.place.description}
                  working_hours={item.working_hours}
                  onReview={(id) => navigate(`/places/${id}/reviews`)}

                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
