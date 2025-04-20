// src/pages/Restaurants/Restaurants.jsx
import React, { useState } from "react";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import PlaceCard from "../../components/PlaceCard/PlaceCard";
import styles from "./Restaurants.module.css";

const dummyData = {
  all: [
    {
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      title: "La Belle Cuisine",
      rating: 4.8,
      location: "Paris, France • French, Italian",
      description:
        "An exquisite dining experience offering the finest French and Italian cuisine prepared by our award-winning chef.",
      features: [
        { icon: "fas fa-clock", text: "Open: 11:00 AM - 11:00 PM" },
        { icon: "fas fa-utensils", text: "Fine Dining" },
        { icon: "fas fa-wine-glass-alt", text: "Wine List" },
      ],
      price: 50,
      unit: "person",
    },
    {
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
      title: "Sakura Sushi Bar",
      rating: 4.9,
      location: "Tokyo, Japan • Japanese, Sushi",
      description:
        "Authentic Japanese sushi experience with fresh fish flown in daily from Tsukiji Market.",
      features: [
        { icon: "fas fa-clock", text: "Open: 5:00 PM - 11:00 PM" },
        { icon: "fas fa-fish", text: "Fresh Seafood" },
        { icon: "fas fa-leaf", text: "Vegetarian Options" },
      ],
      price: 30,
      unit: "person",
    },
    {
      image: "https://images.unsplash.com/photo-1559847844-5315695dadae",
      title: "The Steakhouse",
      rating: 4.6,
      location: "New York, USA • Steakhouse",
      description:
        "Premium cuts of USDA Prime beef, dry-aged in-house for maximum flavor.",
      features: [
        { icon: "fas fa-clock", text: "Open: 5:00 PM - 12:00 AM" },
        { icon: "fas fa-wine-glass-alt", text: "Full Bar" },
        { icon: "fas fa-utensils", text: "Private Dining" },
      ],
      price: 40,
      unit: "person",
    },
  ],
  fine: [],
  casual: [],
  local: [],
};

dummyData.fine = [dummyData.all[0]];
dummyData.casual = [dummyData.all[1], dummyData.all[2]];
dummyData.local = [dummyData.all[2]];

export default function Restaurants() {
  const [tab, setTab] = useState("all");
  const list = dummyData[tab];

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

        <div className={styles.tabGroup}>
          {[
            { key: "all", label: "All" },
            { key: "fine", label: "Fine Dining" },
            { key: "casual", label: "Casual" },
            { key: "local", label: "Local Favorites" },
          ].map((tabInfo) => (
            <button
              key={tabInfo.key}
              className={`${styles.tab} ${tab === tabInfo.key ? styles.active : ""}`}
              onClick={() => setTab(tabInfo.key)}
            >
              {tabInfo.label}
            </button>
          ))}
        </div>

        <div className={styles.placeGrid}>
          {list.map((item, i) => (
            <div key={i} className={styles.cardWrapper}>
              <PlaceCard
                key={i}
                image={item.image}
                title={item.title}
                rating={item.rating}
                location={item.location}
                description={item.description}
                features={item.features}
                price={item.price}
                unit={item.unit}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
