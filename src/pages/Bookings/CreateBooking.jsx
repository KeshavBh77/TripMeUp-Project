import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Booking.module.css";

export default function CreateBooking() {
    const [places, setPlaces] = useState([]);
    const [placeId, setPlaceId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [guests, setGuests] = useState(1);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const loadPlaces = async () => {
            try {
                const res = await fetch("http://localhost:8000/TripMeUpApp/place-list/");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setPlaces(data);
                } else {
                    setPlaces([]);
                }
            } catch (err) {
                console.error("Fetch places error:", err);
            }
        };

        loadPlaces();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || loading || !placeId || !startDate || !endDate) return;

        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/TripMeUpApp/booking/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user.user_id,
                    place_id: placeId,
                    starting_date: startDate,
                    ending_date: endDate,
                    no_of_guests: guests,
                }),
            });

            const data = await res.json();
            console.log("Booking created:", data);
            navigate("/bookings"); // redirect to booking page

        } catch (err) {
            console.error("Booking creation error:", err);
        } finally {
            setLoading(false); // Ensure loading is reset even if there's an error
        }
    };

    return (
        <div className={styles.page}>
            <h1>Create a New Booking</h1>
            <form onSubmit={handleSubmit} className={styles.form}>

                <div className={styles.formGroup}>
                    <label>Select Place</label>
                    <select
                        value={placeId}
                        onChange={(e) => setPlaceId(e.target.value)}
                        required
                    >
                        <option value="">-- Select a Place --</option>
                        {places.map((place) => (
                            <option key={place.place_id} value={place.place_id}>
                                {place.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Starting Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Ending Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Number of Guests</label>
                    <input
                        type="number"
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        required
                        min="1"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !placeId || !startDate || !endDate}
                    className={styles.submitBtn}
                >
                    {loading ? "Creating..." : "Create Booking"}
                </button>
            </form>
        </div>
    );
}
