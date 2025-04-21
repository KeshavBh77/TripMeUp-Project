import React, { useEffect, useState } from "react";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import PlaceCard from "../../components/PlaceCard/PlaceCard";
import styles from "./Accomodation.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";

export default function Accommodations() {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccommodations = async () => {
            try {
                const response = await fetch("http://localhost:8000/TripMeUpApp/accommodation/");
                const data = await response.json();
                setPlaces(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching accommodation data:", error);
                setLoading(false);
            }
        };

        fetchAccommodations();
    }, []);

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.overlay} />
                <div className={styles.content}>
                    <h1>Find Your Perfect Stay</h1>
                    <p>Explore top-rated hotels, boutique inns, and more worldwide</p>
                    <SearchBar className={styles.searchBar}/>
                </div>
            </section>

            <div className={styles.container}>
                <SectionTitle
                    title="Top Accommodations"
                    subtitle="Browse our curated list of best places to stay"
                />

                <div className={styles.tabGroup}>
                    <button className={`${styles.tab} ${styles.active}`}>All</button>
                </div>

                {loading ? (
                    <p>Loading accommodations...</p>
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
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
