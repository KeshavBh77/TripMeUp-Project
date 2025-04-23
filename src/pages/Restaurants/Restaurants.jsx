// src/pages/Restaurants/Restaurants.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import PlaceCard from "../../components/PlaceCard/PlaceCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import Skeleton from "../../components/Skeleton/Skeleton";
import BookingModal from "../../components/BookingModal/BookingModal";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Restaurants.module.css";

export default function Restaurants() {
  const { user } = useContext(AuthContext);
  const [restaurants, setRestaurants] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedName, setSelectedName] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const cardRefs = useRef({});

  // Booking modal state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    guests: 1,
    from: "",
    to: "",
  });
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        await new Promise((r) => setTimeout(r, 1500));
        const data = await fetch(
          "http://localhost:8000/TripMeUpApp/restaurants/"
        ).then((r) => r.json());
        setRestaurants(
          data.map((item) => ({
            ...item,
            imageDescription: item.place.name,
          }))
        );
      } catch (err) {
        console.error("Error fetching restaurant data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleSearch = (txt) => {
    setFilter(txt);
    if (txt.trim() === "") setSelectedName(null);
  };

  const handleSelect = (item) => {
    setFilter(item.label);
    setSelectedName(item.label);
    const el = cardRefs.current[item.label];
    if (!el) return;
    const offset = 220;
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: "smooth" });
    el.classList.add(styles.highlight);
    setTimeout(() => el.classList.remove(styles.highlight), 2000);
  };

  const filtered = restaurants.filter((item) =>
    item.place.name.toLowerCase().includes(filter.toLowerCase())
  );
  const display = selectedName
    ? restaurants.filter((item) => item.place.name === selectedName)
    : filtered;

  const handleBook = (item) => {
    if (!user) return navigate("/login");
    setSelectedPlace(item.place);
    setBookingDetails({ guests: 1, from: "", to: "" });
    setBookingOpen(true);
  };

  const handleBookingSubmit = ({ place, dates, guests }) => {
    console.log("Booking confirmed:", { place, dates, guests });
    setBookingOpen(false);
  };

  const suggestions = restaurants.map((item) => ({
    label: item.place.name,
    imageDescription: item.imageDescription,
    original: item,
  }));

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
          <SearchBar
            value={filter}
            suggestions={suggestions}
            onSearch={handleSearch}
            onSelect={handleSelect}
            placeholder="Search restaurants..."
            onClear={() => {
              setFilter("");
              setSelectedName(null);
            }}
          />
        </div>
      </section>

      <div className={styles.container}>
        <SectionTitle
          title="Featured Restaurants"
          subtitle={
            selectedName ? `Showing: ${selectedName}` : "Top-rated dining experiences"
          }
        />

        {loading ? (
          <div className={styles.placeGrid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.cardWrapper}>
                <Skeleton height="320px" radius="16px" />
              </div>
            ))}
          </div>
        ) : display.length > 0 ? (
          <div className={styles.placeGrid}>
            {display.map((item) => (
              <div
                key={item.place.place_id}
                ref={(el) => (cardRefs.current[item.place.name] = el)}
                className={styles.cardWrapper}
              >
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
                  imageDescription={item.imageDescription}
                  onReview={() =>
                    navigate(`/places/${item.place.place_id}/reviews`)
                  }
                  onBook={() => handleBook(item)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.error}>
            No restaurants match "{filter}"
          </div>
        )}
      </div>

      <BookingModal
        user={user}
        show={bookingOpen}
        place={selectedPlace}
        guests={bookingDetails.guests}
        from={bookingDetails.from}
        to={bookingDetails.to}
        onClose={() => setBookingOpen(false)}
        onSubmit={handleBookingSubmit}
        onChange={(k, v) =>
          setBookingDetails((b) => ({ ...b, [k]: v }))
        }
      />
    </div>
  );
}
