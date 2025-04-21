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

    const [data, setData] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [accommodations, setAccommodations] = useState([]);
    const [view, setView] = useState("restaurants");
    const [bookingOpen, setBookingOpen] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleBook = (place) => {
        setSelectedPlace(place);
        setBookingOpen(true);
    };

    useEffect(() => {
        const fetchCityData = async () => {
            try {
                setLoading(true);

                // Fetch cities
                const cityRes = await fetch(`http://localhost:8000/TripMeUpApp/city/`);
                if (!cityRes.ok) throw new Error("City fetch failed");
                const cities = await cityRes.json();

                const matchedCity = cities.find(
                    (c) => c.name.toLowerCase() === cityKey.toLowerCase()
                );
                if (!matchedCity) throw new Error("City not found");

                setData(matchedCity);

                // Fetch all restaurants and filter by city_id
                const restaurantRes = await fetch(`http://localhost:8000/TripMeUpApp/restaurants/`);
                if (!restaurantRes.ok) throw new Error("Restaurant fetch failed");
                const allRestaurants = await restaurantRes.json();
                console.log("Filtered restaurants:", allRestaurants.filter((r) => r.place.city === matchedCity.city_id));
                setRestaurants(allRestaurants.filter((r) => r.place.city === matchedCity.city_id));

                // Fetch all accommodations and filter by city_id
                const accommodationRes = await fetch(`http://localhost:8000/TripMeUpApp/accommodation/`);
                if (!accommodationRes.ok) throw new Error("Accommodation fetch failed");
                const allAccommodations = await accommodationRes.json();
                console.log("Filtered accommodations:", allAccommodations.filter((a) => a.place.city === matchedCity.city_id));
                setAccommodations(allAccommodations.filter((a) => a.place.city === matchedCity.city_id));
                console.log(`City ID: ${matchedCity.city_id}`);
                console.log("Filtered restaurants:", allRestaurants.filter((r) => r.place.city === matchedCity.city_id));
                console.log("Filtered accommodations:", allAccommodations.filter((a) => a.place.city === matchedCity.city_id));

            } catch (error) {
                console.error("Failed to fetch data:", error);
                setData(null);
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
            <section className={styles.heroDetail}>
                <div className={styles.overlayDetail} />
                <div className={styles.contentDetail}>
                    <h1>{cityKey}</h1><h2>{data.location}</h2>
                    <p>{data.intro}</p>
                </div>
            </section>

            <div className={styles.containerDetail}>
                <SectionTitle title={`About ${cityKey}`} />
                <div className={styles.detailGrid}>
                    <div className={styles.textBlock}>
                        <p>{data.description}</p>
                    </div>
                    <div className={styles.factsBlock}>
                        <h3>Interesting Facts</h3>
                        <ul className={styles.factsList}>
                            {data.facts.split('.').filter(fact => fact.trim().length > 0).map((fact, index) => (
                                <li key={index} className={styles.factItem}>
                                    {fact.trim() + '.'}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Button toggle and place grid */}
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
                    {(view === "restaurants" ? restaurants : accommodations).map((item, i) => (
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
