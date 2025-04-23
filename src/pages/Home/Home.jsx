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
import { FaUser, FaStar } from 'react-icons/fa'; 
import { HiLocationMarker } from 'react-icons/hi';

export default function Home() {
    const [activeTab, setActiveTab] = useState("restaurants");
    const [cities, setCities] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [accommodations, setAccommodations] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
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
                await new Promise(r => setTimeout(r, 1500));

                // Cities
                const cityData = await fetch("http://localhost:8000/TripMeUpApp/city/").then(r => r.json());
                setCities(cityData);

                // Restaurants
                const resData = await fetch("http://localhost:8000/TripMeUpApp/restaurants/").then(r => r.json());
                const topR = Array.isArray(resData)
                    ? resData
                        .sort((a, b) => b.place.rating - a.place.rating)
                        .slice(0, 5)
                        .map((r) => ({
                            ...r.place,
                            imageDescription: r.place.imageDescription || r.place.name
                        }))
                    : [];
                setRestaurants(topR);

                // Accommodations
                const accData = await fetch("http://localhost:8000/TripMeUpApp/accommodation/").then(r => r.json());
                const topA = Array.isArray(accData)
                    ? accData
                        .sort((a, b) => b.place.rating - a.place.rating)
                        .slice(0, 5)
                        .map((a) => ({
                            ...a.place,
                            imageDescription: a.place.imageDescription || a.place.name
                        }))
                    : [];
                setAccommodations(topA);

                // Reviews
                const revData = await fetch("http://localhost:8000/TripMeUpApp/reviews/").then(r => r.json());
                const topRaw = revData.sort((a, b) => b.rating - a.rating).slice(0, 5);
                const topWithUser = await Promise.all(
                    topRaw.map(async rev => {
                        try {
                            const u = await fetch(`http://localhost:8000/TripMeUpApp/users/${rev.user}/`).then(r => r.json());
                            return { ...rev, username: u.username };
                        } catch {
                            return { ...rev, username: "Anonymous" };
                        }
                    })
                );
                setReviews(topWithUser);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleBook = place => {
        setSelectedPlace(place);
        setBookingDetails({ guests: 1, from: "", to: "" });
        setBookingOpen(true);
    };
    const handleBookingSubmit = ({ place, dates, guests }) => {


    };


    // const handleBookingSubmit = async ({ place, dates, guests }) => {
    //   try {
    //     const res = await fetch("http://localhost:8000/TripMeUpApp/booking/", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         client: user.user_id,
    //         place: place.place_id,
    //         starting_date: dates.from,
    //         ending_date: dates.to,
    //         no_of_guests: guests
    //       })
    //     });
    //     if (!res.ok) throw new Error((await res.json()).detail || "Booking failed");
    //     setBookingOpen(false);
    //   } catch (err) {
    //     alert(err.message);
    //   }
    // };



    return (
        <div className={styles.home}>
            <Hero cities={cities} />

            <div className={styles.container}>
                <SectionTitle title="Popular Destinations" subtitle="Explore our most popular cities" />

                {showLoginModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.loginModal}>
                            <p>Please log in to view city details.</p>
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
                        : cities.map(city => (
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
                                    } else navigate(`/cities/${city.name}`);
                                }}
                            >
                                <CityCard
                                    image={city.image_url}
                                    title={city.name}
                                    description={city.location}
                                    types={["Restaurants", "Hotels", "Landmarks"]}
                                    onExplore={() => navigate(`/cities/${city.name}`)}
                                />
                            </div>
                        ))}
                </div>

                <SectionTitle title="Featured Places" subtitle="Discover top-rated options" />
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
                        : (activeTab === "restaurants" ? restaurants : accommodations).map((place, i) => (
                            <div key={i} className={styles.cardWrapper}>
                                <PlaceCard
                                    {...place}
                                    isAccommodation={activeTab === "accommodations"}
                                    onBook={() => handleBook(place)}
                                    onReview={() => navigate(`/places/${place.place_id}/reviews`)}
                                />
                            </div>
                        ))}
                </div>

                <SectionTitle title="Top Rated Reviews" />
                <div className={styles.list}>
                    {loading ? (
                        Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className={styles.cardWrapper}>
                                <Skeleton height="180px" radius="16px" />
                            </div>
                        ))
                    ) : reviews.length ? (
                        reviews.map((rev, i) => (
                            <div key={i} className={styles.cardWrapper}>
                                <div className={`${styles.reviewCard} neo-embed`}>
                                    <div className={styles.header}>
                                        <div className={styles.left}>
                                            <FaUser className={styles.icon} />
                                            <span className={styles.author}>{rev.user.username}</span>
                                        </div>
                                        <div className={styles.right}>
                                            <HiLocationMarker className={styles.icon} />
                                            <span className={styles.placeName}>{rev.place?.name}</span>
                                        </div>
                                    </div>

                                    <div className={styles.contentWrapper}>
                                        <p className={styles.content}>"{rev.comment}"</p>
                                        <div className={styles.footer}>
                                            <div className={styles.rating}>
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        className={`${styles.star} ${i < rev.rating ? '' : styles.empty}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className={styles.date}>
                                                {new Date(rev.created_at || rev.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className={styles.noReviews}>No reviews available.</p>
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
                onChange={(k, v) => setBookingDetails(b => ({ ...b, [k]: v }))}
            />
        </div>
    );
}
