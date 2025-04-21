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

import restaurant from "../../assets/images/restaurant.png";
import hotel1 from "../../assets/images/hotel1.png";

export default function Home() {
    const [activeTab, setActiveTab] = useState("restaurants");
    const [favorites, setFavorites] = useState({});
    const [cities, setCities] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [accommodations, setAccommodations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [bookingOpen, setBookingOpen] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [bookingDetails, setBookingDetails] = useState({ guests: 1, from: '', to: '', guestNames: [''] });

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // Fetch cities, restaurants, and accommodations data
    useEffect(() => {
        const loadData = async () => {
            try {
                // Simulate loading delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Fetch cities
                const cityRes = await fetch("http://localhost:8000/TripMeUpApp/");
                const cityData = await cityRes.json();
                setCities(cityData);

                // Fetch restaurants
                const restaurantRes = await fetch("http://localhost:8000/TripMeUpApp/restaurants/");
                const restaurantData = await restaurantRes.json();
                const topRestaurants = restaurantData
                    .sort((a, b) => b.place.rating - a.place.rating)
                    .slice(0, 5);
                setRestaurants(topRestaurants);

                // Fetch accommodations
                const accommodationRes = await fetch("http://localhost:8000/TripMeUpApp/accommodation/");
                const accommodationData = await accommodationRes.json();
                const topAccommodations = accommodationData
                    .sort((a, b) => b.place.rating - a.place.rating)
                    .slice(0, 5);
                setAccommodations(topAccommodations);

            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const toggleFavorite = (id) => {
        setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleBook = (place) => {
        setSelectedPlace(place);
        setBookingDetails({ guests: 1, from: '', to: '', guestNames: [''] });
        setBookingOpen(true);
    };

  const handleBookingSubmit = ({ place, dates, guests, guestNames }) => {
    console.log("Booking confirmed:", {
      place,
      dates,
      guests,
      guestNames
    });

  };

  const featuredPlaces = {
    restaurants: [
      {
        image: restaurant,
        title: "La Belle Cuisine",
        rating: 4.8,
        location: "Paris, France • French, Italian",
        description: "An exquisite dining experience...",
        features: [
          { icon: "fas fa-clock", text: "Open: 11 AM - 11 PM" },
          { icon: "fas fa-utensils", text: "Fine Dining" },
        ],
        price: 50,
        unit: "person",
      },
    ],
    accommodations: [
      {
        image: hotel1,
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
  };

    const reviews = [
        {
            author: "Sarah Johnson",
            rating: 5,
            date: "May 15, 2023",
            content: "Absolutely fantastic experience...",
        },
        {
            author: "Michael Chen",
            rating: 4,
            date: "April 28, 2023",
            content: "Authentic Japanese sushi experience...",
        },
    ];

    return (
        <div className={styles.home}>
            <Hero cities={cities} />

            <div className={styles.container}>
                <SectionTitle
                    title="Popular Destinations"
                    subtitle="Explore our most popular cities"
                />

                {showLoginModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.loginModal}>
                            <p>Please login to view city details.</p>
                        </div>
                    </div>
                )}

                <div className={styles.list}>
                    {loading
                        ? Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className={styles.cardWrapper}>
                                <Skeleton height="260px" radius="16px" />
                            </div>
                        ))
                        : cities.map((city, i) => (
                            <div key={i} className={styles.cardWrapper}>
                                <CityCard
                                    image={"https://via.placeholder.com/300"}
                                    title={city.name}
                                    description={city.location}
                                    types={["Restaurants", "Hotels", "Landmarks"]}
                                    onExplore={() => {
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
                                />
                            </div>
                        ))}
                </div>

                <SectionTitle
                    title="Featured Places"
                    subtitle="Discover top-rated options"
                />
                <Tabs
                    tabs={[
                        { id: "restaurants", label: "Restaurants" },
                        { id: "accommodations", label: "Accommodations" },
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
                        : (activeTab === "restaurants" ? restaurants : accommodations).map((place, i) => (
                            <div key={i} className={styles.cardWrapper}>
                                <PlaceCard
                                    {...place.place}
                                    isAccommodation={activeTab === "accommodations"}
                                    isFavorite={favorites[i]}
                                    onToggleFavorite={() => toggleFavorite(i)}
                                    onBook={() => handleBook(place)}
                                />
                            </div>
                        ))}
                </div>

                <SectionTitle title="Recent Reviews" subtitle="" />
                <div className={styles.list}>
                    {loading
                        ? Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className={styles.cardWrapper}>
                                <Skeleton height="180px" radius="16px" />
                            </div>
                        ))
                        : reviews.map((rev, i) => (
                            <div key={i} className={styles.cardWrapper}>
                                <ReviewCard {...rev} />
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
        guestNames={bookingDetails.guestNames}
        onClose={() => setBookingOpen(false)}
        onSubmit={handleBookingSubmit}
        onChange={(key, value) => setBookingDetails(prev => ({ ...prev, [key]: value }))}
      />
    </div>
  );
}
