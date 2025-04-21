import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import PlaceCard from "../../components/PlaceCard/PlaceCard";
import BookingModal from "../../components/BookingModal/BookingModal";
import styles from "./CityDetail.module.css";
import {
    FaLandmark,
    FaLanguage,
    FaMoneyBillWave,
    FaPlane,
    FaSubway,
} from "react-icons/fa";

const CityDetail = () => {
    const { title } = useParams();
    const cityKey = title
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

    console.log("Title:", title);
    console.log("City Key:", cityKey);
    const [data, setData] = useState(null);
    const [view, setView] = useState("restaurants");
    const [bookingOpen, setBookingOpen] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleBook = (place) => {
        setSelectedPlace(place);
        setBookingOpen(true);
    };

    // Fetch city data from the Django backend
    // Adjust the URL to match your Django backend endpoint
    useEffect(() => {
        const fetchCityData = async () => {
            try {
                setLoading(true);
                // Replace the API URL with the Django backend URL
                const res = await fetch(`http://localhost:8000/TripMeUpApp/city/${cityKey}`);
                // Check if the response is successful (status code 200-299)
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                const result = await res.json();
                console.log("Fetched data:", result);
                setData(result);
            } catch (error) {
                console.error("you Failed to fetch city data:", error);
                setData({
                    about: "City data could not be loaded.",
                    attractions: [],
                    facts: [],
                    restaurants: [],
                    accommodations: [],
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCityData();
    }, [title]);


    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (!data) return <div className={styles.error}>No data found for {cityKey}</div>;

    return (
        <div>
            {/* Log the city object */}
            {console.log(cityKey, data)}

            <section className={styles.heroDetail}>
                <div className={styles.overlayDetail} />
                <div className={styles.contentDetail}>
                    <h1>
                        {cityKey}, {cityKey.location}
                    </h1>

                    <p>Dummy one liner intro for this city</p>
                </div>
            </section>

            <div className={styles.containerDetail}>
                <SectionTitle title={`About ${cityKey}`} />
                <div className={styles.detailGrid}>
                    <div className={styles.textBlock}>
                        <p>{data.about}</p>
                        <div className={styles.facts}>
                            {data.facts.map((f, i) => {
                                const Icon = getFactIcon(f.icon); // Dynamically resolve icon
                                return (
                                    <div key={i} className={styles.fact}>
                                        <Icon /> {f.label}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className={styles.attractionBlock}>
                        <h3>Top Attractions</h3>
                        <ul>
                            {data.attractions.map((a, i) => (
                                <li key={i} className={styles.attractionItem}>
                                    <FaLandmark className={styles.attractionIcon} /> {a}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <button
                        className={`${styles.toggleBtn} ${view === "restaurants" ? styles.active : ""}`}
                        onClick={() => setView("restaurants")}
                    >
                        Restaurants
                    </button>
                    <button
                        className={`${styles.toggleBtn} ${view === "accommodations" ? styles.active : ""}`}
                        onClick={() => setView("accommodations")}
                    >
                        Accommodations
                    </button>
                </div>

                <div className={styles.placeGrid}>
                    {(view === "restaurants" ? data.restaurants : data.accommodations).map((item, i) => (
                        <div key={i} className={styles.cardWrapper}>
                            <PlaceCard
                                {...item}
                                isAccommodation={view === "accommodations"}
                                onBook={view === "accommodations" ? () => handleBook(item) : undefined}
                            />
                        </div>
                    ))}
                </div>

                <BookingModal
                    show={bookingOpen}
                    place={selectedPlace}
                    onClose={() => setBookingOpen(false)}
                    onSubmit={({ place, dates, guests }) =>
                        console.log("Booking confirmed for", place, dates, guests)
                    }
                />
            </div>
        </div>
    );
};

// Helper to map icon names from backend to icon components
const getFactIcon = (iconName) => {
    switch (iconName) {
        case "language":
            return FaLanguage;
        case "money":
            return FaMoneyBillWave;
        case "plane":
            return FaPlane;
        case "subway":
            return FaSubway;
        default:
            return FaLandmark;
    }
};

export default CityDetail;
