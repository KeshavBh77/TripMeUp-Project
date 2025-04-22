// src/pages/Booking/Bookings.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import Skeleton from "../../components/Skeleton/Skeleton";
import styles from "./Booking.module.css";
import { FaCalendarAlt, FaUser, FaBed, FaCalendarTimes } from "react-icons/fa";

export default function Bookings() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBookings = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/TripMeUpApp/booking/?user_id=${user.user_id}`);
        const data = await res.json();
        console.log("Fetched bookings:", data);

        if (Array.isArray(data)) {
          setList(data);
        } else {
          setList([]);
        }
      } catch (err) {
        console.error("Fetch bookings error:", err);
        setList([]);
      }
      setLoading(false);
    };

    loadBookings();
  }, [user]);

  return (
    <div className={styles.page}>
      <SectionTitle
        title="My Bookings"
        subtitle="Manage your reservations"
      />


      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${styles.btnCreate}`}
          onClick={() => navigate("/create-booking")}
        >
          Create Booking
        </button>
      </div>

      {loading ? (
        <div className={styles.list}>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className={styles.cardWrapper}>
              <Skeleton height="260px" radius="18px" />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className={styles.empty}>
          <FaCalendarTimes className={styles.emptyIcon} />
          <h3>No Bookings Found</h3>
          <p>You don't have any bookings.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {list.map((b, i) => (
            <div key={i} className={styles.cardWrapper}>
              <div className={`${styles.card} neo-embed`}>
                <img
                  src={b.place?.image || "https://via.placeholder.com/300"}
                  alt={b.place?.name || "Place"}
                  className={styles.image}
                />
                <div className={styles.info}>
                  <h3>{b.place.name ? b.place.name : "Unknown Place"}</h3>
                  <div className={styles.meta}>
                    <span>
                      <FaCalendarAlt /> {b.starting_date} - {b.ending_date}
                    </span>
                    <span>
                      <FaUser /> {b.no_of_guests} Guests
                    </span>
                  </div>
                </div>
                <div className={styles.footer}>
                  <div className={styles.price}>${b.price || 0}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
