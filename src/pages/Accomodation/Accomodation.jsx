// src/pages/Accommodations/Accommodations.jsx
import React, { useState } from "react";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import PlaceCard from "../../components/PlaceCard/PlaceCard";
import styles from "./Accomodation.module.css";

const dummyData = {
  all: [
    {
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      title: "Hotel Le Bristol",
      rating: 4.7,
      location: "Paris, France • 5-star Hotel",
      description: "Luxurious rooms with Michelin-starred dining.",
      features: [
        { icon: "fas fa-wifi", text: "Free WiFi" },
        { icon: "fas fa-swimming-pool", text: "Indoor Pool" },
      ],
      price: 450,
      unit: "night",
    },
    {
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      title: "Parisian Boutique",
      rating: 4.4,
      location: "Paris, France • Boutique Hotel",
      description: "Charming boutique experience in the heart of the city.",
      features: [
        { icon: "fas fa-parking", text: "Valet Parking" },
        { icon: "fas fa-spa", text: "Spa Services" },
      ],
      price: 220,
      unit: "night",
    },
    {
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
      title: "Skyline Suites",
      rating: 4.6,
      location: "New York, USA • Luxury Suites",
      description: "Penthouse views and concierge service for VIP guests.",
      features: [
        { icon: "fas fa-concierge-bell", text: "Concierge" },
        { icon: "fas fa-glass-martini-alt", text: "Rooftop Bar" },
      ],
      price: 580,
      unit: "night",
    },
  ],
  luxury: [],
  budget: [],
  boutique: [],
};

dummyData.luxury = [dummyData.all[0], dummyData.all[2]];
dummyData.budget = [dummyData.all[1]];
dummyData.boutique = [dummyData.all[1]];

export default function Accommodations() {
  const [tab, setTab] = useState("all");
  const list = dummyData[tab];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.overlay} />
        <div className={styles.content}>
          <h1>Find Your Perfect Stay</h1>
          <p>Explore top-rated hotels, boutique inns, and more worldwide</p>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search for hotels, hostels, or locations..."
            />
            <button>
              <i className="fas fa-search" /> Search
            </button>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <SectionTitle
          title="Top Accommodations"
          subtitle="Browse our curated list of best places to stay"
        />

        <div className={styles.tabGroup}>
          {[
            { key: "all", label: "All" },
            { key: "luxury", label: "Luxury" },
            { key: "budget", label: "Budget" },
            { key: "boutique", label: "Boutique" },
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

        <div className={styles.grid}>
          {list.map((item, i) => (
            <div key={i} className={styles.cardWrapper}>
              <PlaceCard
                image={item.image}
                title={item.title}
                isAccommodation={true}
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
