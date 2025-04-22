// src/pages/Accomodation/Accomodation.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import PlaceCard from "../../components/PlaceCard/PlaceCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import Skeleton from "../../components/Skeleton/Skeleton";
import BookingModal from "../../components/BookingModal/BookingModal";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Accomodation.module.css";

export default function Accommodations() {
  const { user } = useContext(AuthContext);
  const [places, setPlaces] = useState([]);
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
    guestNames: [""],
  });
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        await new Promise((res) => setTimeout(res, 1500));
        const data = await fetch(
          "http://localhost:8000/TripMeUpApp/accommodation/"
        ).then((r) => r.json());
        setPlaces(
          data.map((item) => ({
            ...item,
            imageDescription: item.place.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching accommodation data:\n", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  const handleSearch = (txt) => {
    setFilter(txt);
    if (txt.trim() === "") {
      setSelectedName(null);
    }
  };

  const handleSelect = (item) => {
    setFilter(item.label);
    setSelectedName(item.label);

    const el = cardRefs.current[item.label];
    if (!el) return;
    const offset = 200;
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: "smooth" });

    el.classList.add(styles.highlight);
    setTimeout(() => el.classList.remove(styles.highlight), 2000);
  };

  const filtered = places.filter((item) =>
    item.place.name.toLowerCase().includes(filter.toLowerCase())
  );
  const display = selectedName
    ? places.filter((item) => item.place.name === selectedName)
    : filtered;

  const handleBook = (item) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSelectedPlace(item.place);
    setBookingDetails({ guests: 1, from: "", to: "", guestNames: [""] });
    setBookingOpen(true);
  };

  const handleBookingSubmit = ({ place, dates, guests }) => {
    console.log("Booking confirmed:", { place, dates, guests });
    setBookingOpen(false);
  };

  const suggestions = places.map((item) => ({
    label: item.place.name,
    imageDescription: item.imageDescription,
    original: item,
  }));

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.overlay} />
        <div className={styles.content}>
          <h1>Find Your Perfect Stay</h1>
          <p>Explore top-rated hotels, boutique inns, and more worldwide</p>
          <SearchBar
            value={filter}
            suggestions={suggestions}
            onSearch={handleSearch}
            onSelect={handleSelect}
            placeholder="Search accommodations..."
            onClear={() => {
              setFilter("");
              setSelectedName(null);
            }}
            className={styles.searchBar}
          />
        </div>
      </section>

      <div className={styles.container}>
        <SectionTitle
          title="Top Accommodations"
          subtitle={
            selectedName
              ? `Showing: ${selectedName}`
              : "Browse our curated list of best places to stay"
          }
        />

        <div className={styles.grid}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.cardWrapper}>
                <Skeleton height="320px" radius="16px" />
              </div>
            ))
          ) : display.length > 0 ? (
            display.map((item) => (
              <div
                key={item.place.place_id}
                ref={(el) =>
                  (cardRefs.current[item.place.name] = el)
                }
                className={styles.cardWrapper}
              >
                <PlaceCard
                  name={item.place.name}
                  contact={item.place.contact}
                  address={item.place.address}
                  street={item.place.street}
                  postal_code={item.place.postal_code}
                  email={item.place.email}
                  rating={item.place.rating}
                  description={item.place.description}
                  type={item.type}
                  charge={item.charge}
                  amenities={item.amenities}
                  imageDescription={item.imageDescription}
                  isAccommodation
                  onReview={() =>
                    navigate(`/places/${item.place.place_id}/reviews`)
                  }
                  onBook={() => handleBook(item)}
                />
              </div>
            ))
          ) : (
            <div className={styles.error}>
              No accommodations match "{filter}"
            </div>
          )}
        </div>
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
        onChange={(key, value) =>
          setBookingDetails((b) => ({ ...b, [key]: value }))
        }
      />
    </div>
  );
}

