// src/pages/Accomodation/Accomodation.jsx
import React, { useEffect, useState, useContext } from "react";
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Booking modal state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    guests: 1,
    from: "",
    to: "",
    guestNames: [""],
  });

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        await new Promise((res) => setTimeout(res, 1500)); // simulate delay
        const response = await fetch(
          "http://localhost:8000/TripMeUpApp/accommodation/"
        );
        const data = await response.json();
        setPlaces(data);
      } catch (error) {
        console.error("Error fetching accommodation data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  const handleBook = (item) => {
    if (!user) {
      // redirect to login if not authenticated
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
    // you can also POST to backend here...
  };

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.overlay} />
        <div className={styles.content}>
          <h1>Find Your Perfect Stay</h1>
          <p>Explore top-rated hotels, boutique inns, and more worldwide</p>
          <SearchBar className={styles.searchBar} />
        </div>
      </section>

      {/* Content Section */}
      <div className={styles.container}>
        <SectionTitle
          title="Top Accommodations"
          subtitle="Browse our curated list of best places to stay"
        />

        <div className={styles.tabGroup}>
          <button className={`${styles.tab} ${styles.active}`}>All</button>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.cardWrapper}>
                <Skeleton height="320px" radius="16px" />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.grid}>
            {places.map((item, index) => (
              <div key={index} className={styles.cardWrapper}>
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
                  isAccommodation={true}
                  onReview={() =>
                    navigate(`/places/${item.place.place_id}/reviews`)
                  }
                  onBook={() => handleBook(item)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
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
