import React, { useState } from "react";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import PlaceCard from "../../components/PlaceCard/PlaceCard";
import CityCard from "../../components/CityCard/CityCard";
import BookingModal from "../../components/BookingModal/BookingModal";
import styles from "./Favorites.module.css";
import { useNavigate } from "react-router-dom";

// Dummy data for favorites
const dummyFavorites = {
  restaurants: [
    {
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      title: "La Belle Cuisine",
      rating: 4.8,
      location: "Paris, France • French, Italian",
      description: "An exquisite dining experience...",
      features: [
        { icon: "fas fa-clock", text: "Open: 11:00 AM - 11:00 PM" },
        { icon: "fas fa-utensils", text: "Fine Dining" },
      ],
      price: 50,
      unit: "person",
    },
  ],
  hotels: [
    {
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      title: "Grand Plaza Hotel",
      rating: 4.7,
      location: "New York, USA • 5-star Hotel",
      description: "Luxury accommodations...",
      features: [
        { icon: "fas fa-wifi", text: "Free WiFi" },
        { icon: "fas fa-swimming-pool", text: "Pool" },
      ],
      price: 250,
      unit: "night",
    },
  ],
  cities: [
    {
      image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325",
      title: "Paris",
      description: "The city of love and lights.",
      types: ["Restaurants", "Hotels", "Landmarks"],
    },
  ],
};

export default function Favorites() {
  const [tab, setTab] = useState("restaurants");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const navigate = useNavigate();
  const list = dummyFavorites[tab];
  const tabs = [
    { key: "restaurants", label: "Restaurants" },
    { key: "hotels", label: "Hotels" },
    { key: "cities", label: "Cities" },
  ];

  const handleBook = (place) => {
    setSelectedPlace(place);
    setBookingOpen(true);
  };

  return (
    <div className={styles.page}>
      <SectionTitle
        title="My Favorites"
        subtitle="Your saved places for future trips"
      />

      <div className={styles.tabGroup}>
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`${styles.tab} ${tab === t.key ? styles.active : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {list.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fas fa-heart-broken"></i>
            <h3>No Favorites Yet</h3>
            <p>Save places to see them here.</p>
          </div>
        ) : (
          list.map((item, i) => (
            <div key={i} className={styles.cardWrapper}>
              {tab === "cities" ? (
                <CityCard
                  {...item}
                  onExplore={() => navigate(`/cities/${item.title}`)}
                />
              ) : (
                <PlaceCard
                  {...item}
                  isAccommodation={tab === "hotels"}
                  onBook={() => handleBook(item)}
                />
              )}
            </div>
          ))
        )}
      </div>

      <BookingModal
        show={bookingOpen}
        place={selectedPlace}
        onClose={() => setBookingOpen(false)}
        onSubmit={({ place, dates, guests }) =>
          console.log("Booking confirmed", place, dates, guests)
        }
      />
    </div>
  );
}
