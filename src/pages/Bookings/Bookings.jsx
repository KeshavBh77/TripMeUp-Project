import React, { useState, useEffect, useContext } from "react";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import Skeleton from "../../components/Skeleton/Skeleton";
import { AuthContext } from "../../context/AuthContext";
import BookingModal from "../../components/BookingModal/BookingModal";
import styles from "./Booking.module.css";
import { FaCalendarTimes, FaPlus } from "react-icons/fa";

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

  // load existing bookings
  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const res  = await fetch(
        `http://localhost:8000/TripMeUpApp/booking/?user_id=${user.user_id}`
      );
      const data = await res.json().catch(() => []);
      setBookings(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
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
    // POST new booking
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
    // reload
    setLoading(true);
    const res  = await fetch(
      `http://localhost:8000/TripMeUpApp/booking/?user_id=${user.user_id}`
    );
    const data = await res.json().catch(() => []);
    setBookings(Array.isArray(data) ? data : []);
    setLoading(false);
    setModalOpen(false);
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
            <div key={b.booking_id} className={styles.cardWrapper}>
              <div className={`${styles.card} neo-embed`}>
                <img
                  src={b.place?.image || "https://via.placeholder.com/300"}
                  alt={b.place?.name || "Place"}
                  className={styles.image}
                />
                <div className={styles.info}>
                  <h3>{b.place?.name || "Unknown Place"}</h3>
                  <div className={styles.meta}>
                    <span>{b.starting_date} → {b.ending_date}</span>
                    <span>{b.no_of_guests} Guests</span>
                  </div>
                </div>
                <div className={styles.footer}>
                  <div className={styles.price}>${b.charge || 0}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit modal */}
      <BookingModal
        user={user}
        show={modalOpen}
        place={places.find(p => p.place_id === +details.placeId) || null}
        guests={details.guests}
        from={details.from}
        to={details.to}
        onClose={() => setModalOpen(false)}
        onChange={(key, val) =>
          setDetails(d => ({ ...d, [key]: val }))
        }
        onSubmit={handleSubmit}
      >
        {/* Step 0 extra: place selector */}
        <div className={styles.formGroup}>
          <label>Select Place</label>
          <select
            value={details.placeId || ""}
            onChange={e => setDetails(d => ({
              ...d, placeId: e.target.value
            }))}
            required
          >
            <option value="">— pick a place —</option>
            {places.map(p=>(
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
