// src/pages/Home/Home.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../../components/Hero/Hero";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import CityCard from "../../components/CityCard/CityCard";
import Tabs from "../../components/Tabs/Tabs";
import PlaceCard from "../../components/PlaceCard/PlaceCard";
import ReviewCard from "../../components/ReviewCard/ReviewCard";
import Skeleton from "../../components/Skeleton/Skeleton";
import BookingModal from "../../components/BookingModal/BookingModal";
import styles from "./Home.module.css";
import { AuthContext } from "../../context/AuthContext";

export default function Home() {
  const [activeTab, setActiveTab] = useState("restaurants");
  const [favorites, setFavorites] = useState({});
  const [cities, setCities] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    guests: 1,
    from: "",
    to: ""
  });
  

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise((r) => setTimeout(r, 1500));

        // cities
        const cityRes = await fetch("http://localhost:8000/TripMeUpApp/city/");
        const cityData = await cityRes.json();
        setCities(cityData);

        // restaurants (API returns [{ place: {...}, working_hours, ... }, ...])
        const resRes = await fetch("http://localhost:8000/TripMeUpApp/restaurants/");
        const resData = await resRes.json();
        const topR = Array.isArray(resData)
          ? resData
              .sort((a, b) => b.place.rating - a.place.rating)
              .slice(0, 5)
          : [];
        setRestaurants(topR);

        // accommodations
        const accRes = await fetch("http://localhost:8000/TripMeUpApp/accommodation/");
        const accData = await accRes.json();
        const topA = Array.isArray(accData)
          ? accData
              .sort((a, b) => b.place.rating - a.place.rating)
              .slice(0, 5)
          : [];
        setAccommodations(topA);

                // Fetch reviews
                const reviewsRes = await fetch("http://localhost:8000/TripMeUpApp/reviews/");
                const reviewsData = await reviewsRes.json();
                const topReviewsRaw = reviewsData
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 5);

                // Add usernames to reviews
                const topReviews = await Promise.all(
                    topReviewsRaw.map(async (review) => {
                        try {
                            const userRes = await fetch(`http://localhost:8000/TripMeUpApp/users/${review.user}/`);
                            const userData = await userRes.json();
                            return { ...review, username: userData.username };
                        } catch {
                            return { ...review, username: 'Anonymous' };
                        }
                    })
                );

                setReviews(topReviews);


            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

  // favorites toggle
  const toggleFavorite = (id) =>
    setFavorites((f) => ({ ...f, [id]: !f[id] }));

  // open booking modal with real Place object
  const handleBook = (place) => {
    setSelectedPlace(place);
    setBookingDetails({ guests: 1, from: "", to: "" });
    setBookingOpen(true);
  };

  // submits booking to backend
  const handleBookingSubmit = async ({ place, dates, guests }) => {
    try {
      const res = await fetch("http://localhost:8000/TripMeUpApp/booking/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: user.user_id,
          place: place.place_id,
          starting_date: dates.from,
          ending_date: dates.to,
          no_of_guests: guests
        })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Booking creation failed");
      }
      // optional: you can refresh “my bookings” or show a toast
      setBookingOpen(false);
    } catch (err) {
      console.error("Booking failed:", err);
      alert(err.message);
    }
  };

  return (
    <div className={styles.home}>
      <Hero cities={cities} />

      <div className={styles.container}>
        <SectionTitle
          title="Popular Destinations"
          subtitle="Explore our most popular cities"
        />

        {/* login prompt */}
        {showLoginModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.loginModal}>
              <p>Please log in to view city details.</p>
            </div>
          </div>
        )}

        {/* city cards */}
        <div className={styles.list}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={styles.cardWrapper}>
                  <Skeleton height="260px" radius="16px" />
                </div>
              ))
            : cities.map((city) => (
                <div
                  key={city.city_id}
                  className={styles.cardWrapper}
                  onClick={() => {
                    if (!user) {
                      setShowLoginModal(true);
                      setTimeout(() => {
                        setShowLoginModal(false);
                        navigate("/login");
                      }, 1500);
                    } else {
                      navigate(`/cities/${city.name}`);
                    }
                  }}
                >
                  <CityCard
                    image="https://via.placeholder.com/300"
                    title={city.name}
                    description={city.location}
                    types={["Restaurants", "Hotels", "Landmarks"]}
                    onExplore={() => navigate(`/cities/${city.name}`)}
                  />
                </div>
              ))}
        </div>

        {/* featured restaurants / accommodations */}
        <SectionTitle
          title="Featured Places"
          subtitle="Discover top-rated options"
        />
        <Tabs
          tabs={[
            { id: "restaurants", label: "Restaurants" },
            { id: "accommodations", label: "Accommodations" }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div className={styles.list}>
          {loading
            ? Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className={styles.cardWrapper}>
                  <Skeleton height="320px" radius="20px" />
                </div>
              ))
            : (activeTab === "restaurants"
                ? restaurants
                : accommodations
              ).map((rec, i) => (
                <div key={i} className={styles.cardWrapper}>
                  <PlaceCard
                    {...rec.place}
                    isAccommodation={activeTab === "accommodations"}
                    isFavorite={favorites[i]}
                    onToggleFavorite={() => toggleFavorite(i)}
                    onBook={() => handleBook(rec.place)}
                    onReview={() =>
                      navigate(`/places/${rec.place.place_id}/reviews`)
                    }
                  />
                </div>
              ))}
        </div>

                <SectionTitle title="Top Rated Reviews" subtitle="" />
                <div className={styles.list}>
                    {loading
                        ? Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className={styles.cardWrapper}>
                                <Skeleton height="180px" radius="16px" />
                            </div>
                        ))
                        : reviews.map((rev, i) => (
                            <div key={i} className={styles.cardWrapper}>
                                <ReviewCard
                                    author={rev.username || "Anonymous"}
                                    rating={rev.rating}
                                    date={new Date(rev.created_at || rev.date).toLocaleDateString()}
                                    content={rev.comment}
                                />
                            </div>
                        ))}
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
        onChange={(k, v) =>
          setBookingDetails((b) => ({ ...b, [k]: v }))
        }
      />
    </div>
  );
}
