import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import PlaceCard from "../../components/PlaceCard/PlaceCard";
import BookingModal from "../../components/BookingModal/BookingModal";
import Skeleton from "../../components/Skeleton/Skeleton";
import styles from "./CityDetail.module.css";
import { FaLandmark, FaLanguage, FaMoneyBillWave, FaPlane, FaSubway } from "react-icons/fa";

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
        const simulateDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

        const fetchCityData = async () => {
            try {
                setLoading(true);

                const cityRes = await fetch(`http://localhost:8000/TripMeUpApp/city/`);
                if (!cityRes.ok) throw new Error("City fetch failed");
                const cities = await cityRes.json();

                const matchedCity = cities.find(
                    (c) => c.name.toLowerCase() === cityKey.toLowerCase()
                );
                if (!matchedCity) throw new Error("City not found");

                setData(matchedCity);

                const [restaurantRes, accommodationRes] = await Promise.all([
                    fetch(`http://localhost:8000/TripMeUpApp/restaurants/`),
                    fetch(`http://localhost:8000/TripMeUpApp/accommodation/`)
                ]);

                if (!restaurantRes.ok || !accommodationRes.ok) throw new Error("Data fetch failed");

                const [allRestaurants, allAccommodations] = await Promise.all([
                    restaurantRes.json(),
                    accommodationRes.json()
                ]);

                setRestaurants(allRestaurants.filter((r) => r.place.city === matchedCity.city_id));
                setAccommodations(allAccommodations.filter((a) => a.place.city === matchedCity.city_id));
            } catch (error) {
                console.error("Failed to fetch data:", error);
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
                        <div className={styles.spinner}></div>
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
                                    {data.facts.split('.').filter(fact => fact.trim().length > 0).map((fact, index) => (
                                        <li key={index} className={styles.factItem}>
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

                <div className={styles.grid}>
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className={styles.cardWrapper}>
                                <Skeleton height="320px" radius="16px" />
                            </div>
                        ))
                    ) : view === "restaurants" ? (
                        restaurants.map((item, index) => (
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
                                    isAccommodation={false}
                                />
                            </div>
                        ))
                    ) : (
                        accommodations.map((item, index) => (
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
                                    onBook={() => handleBook(item)} 

                                  
                                />
                            </div>
                        ))
                    )}
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
        case "language": return FaLanguage;
        case "money": return FaMoneyBillWave;
        case "plane": return FaPlane;
        case "subway": return FaSubway;
        default: return FaLandmark;
    }
};

export default CityDetail;
