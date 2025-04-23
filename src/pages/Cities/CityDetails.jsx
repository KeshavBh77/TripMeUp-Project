// src/pages/CityDetail/CityDetail.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import PlaceCard from "../../components/PlaceCard/PlaceCard";
import BookingModal from "../../components/BookingModal/BookingModal";
import Skeleton from "../../components/Skeleton/Skeleton";
import useUnsplash from "../../hooks/useUnsplash";
import styles from "./CityDetail.module.css";
import { AuthContext } from "../../context/AuthContext";

const CityDetail = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const cityKey = title
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // get a nice Unsplash image
  const heroImage = useUnsplash(cityKey);

  const [data, setData] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [view, setView] = useState("restaurants");
  const [loading, setLoading] = useState(true);

  // Booking modal
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    guests: 1,
    from: "",
    to: "",
    guestNames: [""],
  });

  const handleBook = (place) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSelectedPlace(place);
    setBookingDetails({ guests: 1, from: "", to: "", guestNames: [""] });
    setBookingOpen(true);
  };

  const handleBookingSubmit = ({ place, dates, guests }) => {
    console.log("Booking confirmed:", { place, dates, guests });
    setBookingOpen(false);
  };

  const handleReview = (place) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/places/${place.place_id}/reviews`);
  };

  useEffect(() => {
    const fetchCityData = async () => {
      setLoading(true);
      try {
        const cityRes = await fetch("http://localhost:8000/TripMeUpApp/city/");
        const citiesList = await cityRes.json();
        const matched = citiesList.find(
          (c) => c.name.toLowerCase() === cityKey.toLowerCase()
        );
        setData(matched || null);

        const [resRes, accRes] = await Promise.all([
          fetch("http://localhost:8000/TripMeUpApp/restaurants/"),
          fetch("http://localhost:8000/TripMeUpApp/accommodation/"),
        ]);
        const [allRestaurants, allAccommodations] = await Promise.all([
          resRes.json(),
          accRes.json(),
        ]);

        setRestaurants(
          matched
            ? allRestaurants.filter((r) => r.place.city === matched.city_id)
            : []
        );
        setAccommodations(
          matched
            ? allAccommodations.filter((a) => a.place.city === matched.city_id)
            : []
        );
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCityData();
  }, [title, cityKey]);

  return (
    <div>
      {/* Hero */}
      <section
        className={styles.heroDetail}
        style={{
          backgroundImage: `linear-gradient(
              135deg,
              rgba(0,0,0,0.6) 0%,
              rgba(0,0,0,0.3) 100%
            ),
            url(${heroImage}`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={styles.overlayDetail} />
        <div className={styles.contentDetail}>
          {loading ? (
            <>
              <Skeleton height="40px" width="60%" />
              <Skeleton height="30px" width="40%" style={{ marginTop: "1rem" }} />
              <Skeleton height="80px" width="80%" style={{ marginTop: "1rem" }} />
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

      {/* Main */}
      <div className={styles.containerDetail}>
        <SectionTitle title={`About ${cityKey}`} />

        {loading ? (
          <div className={styles.spinnerWrap}>
            <div className={styles.spinner} />
          </div>
        ) : (
          <div className={styles.detailGrid}>
            <div className={styles.textBlock}>
              <p>{data?.description}</p>
            </div>
            <div className={styles.factsBlock}>
              <h3>Interesting Facts</h3>
              {data?.facts ? (
                <ul className={styles.factsList}>
                  {data.facts
                    .split(".")
                    .filter((f) => f.trim())
                    .map((fact, i) => (
                      <li key={i} className={styles.factItem}>
                        {fact.trim()}.
                      </li>
                    ))}
                </ul>
              ) : (
                <p>No interesting facts available.</p>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.toggleBtn} ${
              view === "restaurants" ? styles.active : ""
            }`}
            onClick={() => setView("restaurants")}
          >
            Restaurants
          </button>
          <button
            className={`${styles.toggleBtn} ${
              view === "accommodations" ? styles.active : ""
            }`}
            onClick={() => setView("accommodations")}
          >
            Accommodations
          </button>
        </div>

        {/* Listings */}
        <div className={styles.list}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={styles.cardWrapper}>
                  <Skeleton height="320px" radius="16px" />
                </div>
              ))
            : view === "restaurants"
            ? restaurants.map((item) => (
                <div key={item.place.place_id} className={styles.cardWrapper}>
                  <PlaceCard
                    {...item.place}
                    isAccommodation={false}
                    onBook={() => handleBook(item.place)}
                    onReview={() => handleReview(item.place)}
                  />
                </div>
              ))
            : accommodations.map((item) => (
                <div key={item.place.place_id} className={styles.cardWrapper}>
                  <PlaceCard
                    {...item.place}
                    isAccommodation={true}
                    onBook={() => handleBook(item.place)}
                    onReview={() => handleReview(item.place)}
                  />
                </div>
              ))}
        </div>

        {/* Booking */}
        <BookingModal
          user={user}
          show={bookingOpen}
          place={selectedPlace}
          guests={bookingDetails.guests}
          from={bookingDetails.from}
          to={bookingDetails.to}
          onClose={() => setBookingOpen(false)}
          onChange={(k, v) => setBookingDetails((b) => ({ ...b, [k]: v }))}
          onSubmit={handleBookingSubmit}
        />
      </div>
    </div>
  );
};

export default CityDetail;
