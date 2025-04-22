import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import PlaceCard from "../../components/PlaceCard/PlaceCard";
import BookingModal from "../../components/BookingModal/BookingModal";
import Skeleton from "../../components/Skeleton/Skeleton";
import styles from "./CityDetail.module.css";
import {
  FaLandmark,
  FaLanguage,
  FaMoneyBillWave,
  FaPlane,
  FaSubway,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const CityDetail = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const cityKey = title
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [view, setView] = useState("restaurants");
  const [loading, setLoading] = useState(true);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    guests: 1,
    from: "",
    to: "",
    guestNames: [""],
  });

  const handleBook = (place) => {
    setSelectedPlace(place);
    setBookingDetails({ guests: 1, from: "", to: "", guestNames: [""] });
    setBookingOpen(true);
  };

  const handleBookingSubmit = ({ place, dates, guests, guestNames }) => {
    console.log("Booking confirmed:", { place, dates, guests, guestNames });
    setBookingOpen(false);
  };

  useEffect(() => {
    const fetchCityData = async () => {
      setLoading(true);
      try {
        const cityRes = await fetch(`http://localhost:8000/TripMeUpApp/city/`);
        if (!cityRes.ok) throw new Error("City fetch failed");
        const citiesList = await cityRes.json();
        const matched = citiesList.find(
          (c) => c.name.toLowerCase() === cityKey.toLowerCase()
        );
        if (!matched) throw new Error("City not found");
        setData(matched);

        const [resRes, accRes] = await Promise.all([
          fetch(`http://localhost:8000/TripMeUpApp/restaurants/`),
          fetch(`http://localhost:8000/TripMeUpApp/accommodation/`),
        ]);
        if (!resRes.ok || !accRes.ok) throw new Error("Data fetch failed");
        const [allRestaurants, allAccommodations] = await Promise.all([
          resRes.json(),
          accRes.json(),
        ]);
        setRestaurants(
          allRestaurants.filter((r) => r.place.city === matched.city_id)
        );
        setAccommodations(
          allAccommodations.filter((a) => a.place.city === matched.city_id)
        );
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCityData();
  }, [title]);

  return (
    <div>
      <section className={styles.heroDetail}>
        <div className={styles.overlayDetail} />
        <div className={styles.contentDetail}>
          {loading ? (
            <>
              <Skeleton height="40px" width="60%" />
              <Skeleton height="30px" width="40%" style={{ marginTop: '1rem' }} />
              <Skeleton height="80px" width="80%" style={{ marginTop: '1rem' }} />
            </>
          ) : data ? (
            <>
              <h1>{cityKey}</h1>
              <h2>{data.location}</h2>
              <p>{data.intro}</p>
            </>
          ) : (
            <div className={styles.error}>No data found for {cityKey}</div>
          )}
        </div>
      </section>

      <div className={styles.containerDetail}>
        <SectionTitle title={`About ${cityKey}`} />
        {loading ? (
          <div className={styles.spinnerWrap}>
            <div className={styles.spinner} />
          </div>
        ) : (
          <div className={styles.detailGrid}>
            <div className={styles.textBlock}>
              <p>{data.description}</p>
            </div>
            <div className={styles.factsBlock}>
              <h3>Interesting Facts</h3>
              {data.facts ? (
                <ul className={styles.factsList}>
                  {data.facts
                    .split('.')
                    .filter((f) => f.trim())
                    .map((fact, i) => (
                      <li key={i} className={styles.factItem}>
                        {fact.trim() + '.'}
                      </li>
                    ))}
                </ul>
              ) : (
                <p className={styles.noFacts}>No interesting facts available.</p>
              )}
            </div>
          </div>
        )}

        <div className={styles.buttonGroup}>
          <button
            className={`${styles.toggleBtn} ${view === 'restaurants' ? styles.active : ''}`}
            onClick={() => setView('restaurants')}
          >
            Restaurants
          </button>
          <button
            className={`${styles.toggleBtn} ${view === 'accommodations' ? styles.active : ''}`}
            onClick={() => setView('accommodations')}
          >
            Accommodations
          </button>
        </div>

        {/* Use the same list layout as other pages */}
        <div className={styles.list}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.cardWrapper}>
                <Skeleton height="320px" radius="16px" />
              </div>
            ))
          ) : view === 'restaurants' ? (
            restaurants.map((item, i) => (
              <div key={i} className={styles.cardWrapper}>
                <PlaceCard {...item.place} isAccommodation={false} onBook={() => handleBook(item)} />
              </div>
            ))
          ) : (
            accommodations.map((item, i) => (
              <div key={i} className={styles.cardWrapper}>
                <PlaceCard {...item.place} isAccommodation={true} onBook={() => handleBook(item)} />
              </div>
            ))
          )}
        </div>

        <BookingModal
          user={user}
          show={bookingOpen}
          place={selectedPlace}
          guests={bookingDetails.guests}
          from={bookingDetails.from}
          to={bookingDetails.to}
          guestNames={bookingDetails.guestNames}
          onClose={() => setBookingOpen(false)}
          onSubmit={handleBookingSubmit}
          onChange={(key, value) => setBookingDetails((p) => ({ ...p, [key]: value }))}
        />
      </div>
    </div>
);
};

export default CityDetail;