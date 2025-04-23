// src/pages/Bookings/Bookings.jsx
import React, { useState, useEffect, useContext } from "react";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import Skeleton from "../../components/Skeleton/Skeleton";
import { AuthContext } from "../../context/AuthContext";
import BookingModal from "../../components/BookingModal/BookingModal";
import { FaCalendarTimes, FaPlus } from "react-icons/fa";
import useUnsplash from "../../hooks/useUnsplash";
import styles from "./Booking.module.css";

function BookingCard({ booking, onReload }) {
  // try Unsplash on the place name
  const unsplashUrl = useUnsplash(booking.place?.name);
  const imageUrl =unsplashUrl;

  return (
    <div className={styles.cardWrapper}>
      <div className={`${styles.card} neo-embed`}>
        <img
          src={imageUrl}
          alt={booking.place?.name || "Place"}
          className={styles.image}
        />
        <div className={styles.info}>
          <h3>{booking.place?.name || "Unknown Place"}</h3>
          <div className={styles.meta}>
            <span>{booking.starting_date} → {booking.ending_date}</span>
            <span>{booking.no_of_guests} Guests</span>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.price}>${booking.charge || 0}</div>
        </div>
      </div>
    </div>
  );
}

export default function Bookings() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading]     = useState(true);
  const [bookings, setBookings]   = useState([]);
  const [places, setPlaces]       = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [details, setDetails]     = useState({
    placeId: null,
    from:    "",
    to:      "",
    guests:  1
  });

  const reloadBookings = async () => {
    if (!user) return;
    setLoading(true);
    const res  = await fetch(
      `http://localhost:8000/TripMeUpApp/booking/?user_id=${user.user_id}`
    );
    const data = await res.json().catch(() => []);
    setBookings(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  // load existing bookings
  useEffect(() => {
    reloadBookings();
  }, [user]);

  // load place-list for creation
  useEffect(() => {
    (async () => {
      const res  = await fetch("http://localhost:8000/TripMeUpApp/place-list/");
      const data = await res.json().catch(() => []);
      setPlaces(Array.isArray(data) ? data : []);
    })();
  }, []);

  const handleCreate = () => {
    setDetails({ placeId: null, from: "", to: "", guests: 1 });
    setModalOpen(true);
  };

  const handleSubmit = async ({ place, dates, guests }) => {
    await fetch("http://localhost:8000/TripMeUpApp/booking/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id:       user.user_id,
        place_id:      place.place_id,
        starting_date: dates.from,
        ending_date:   dates.to,
        no_of_guests:  guests
      })
    });

    await reloadBookings();
  };

  return (
    <div className={styles.page}>
      <SectionTitle title="My Bookings" subtitle="Manage your reservations" />

      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${styles.btnCreate}`}
          onClick={handleCreate}
        >
          <FaPlus /> Create Booking
        </button>
      </div>

      {loading ? (
        <div className={styles.list}>
          {[0,1].map(i => (
            <div key={i} className={styles.cardWrapper}>
              <Skeleton height="260px" radius="18px" />
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className={styles.empty}>
          <FaCalendarTimes className={styles.emptyIcon} />
          <h3>No Bookings Found</h3>
          <p>You don’t have any bookings yet.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {bookings.map(b => (
            <BookingCard
              key={b.booking_id}
              booking={b}
              onReload={reloadBookings}
            />
          ))}
        </div>
      )}

      <BookingModal
        user={user}
        show={modalOpen}
        place={places.find(p => p.place_id === +details.placeId) || null}
        guests={details.guests}
        from={details.from}
        to={details.to}
        onClose={() => setModalOpen(false)}
        onChange={(k, v) => setDetails(d => ({ ...d, [k]: v }))}
        onSubmit={handleSubmit}
      >

        <div className={styles.formGroup}>
          <label>Select Place</label>
          <select
            value={details.placeId || ""}
            onChange={e => setDetails(d => ({
              ...d,
              placeId: e.target.value
            }))}
            required
          >
            <option value="">— pick a place —</option>
            {places.map(p => (
              <option key={p.place_id} value={p.place_id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </BookingModal>
    </div>
  );
}
