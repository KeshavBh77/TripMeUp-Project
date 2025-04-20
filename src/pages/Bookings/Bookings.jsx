// src/pages/Bookings/Bookings.jsx
import React, { useState } from "react";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import styles from "./Booking.module.css";
import { FaCalendarAlt, FaUser, FaBed, FaCalendarTimes } from "react-icons/fa";

const dummyBookings = {
  upcoming: [
    {
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      title: "Grand Plaza Hotel",
      date: "Jun 15 - Jun 20, 2023",
      guests: "2 Adults",
      room: "Deluxe King Room",
      status: "Confirmed",
      price: 1250,
      actions: ["Modify", "Cancel"],
    },
    {
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      title: "La Belle Cuisine",
      date: "Jun 18, 2023",
      guests: "4 People",
      room: "Dinner Reservation",
      status: "Confirmed",
      price: 320,
      actions: ["Modify", "Cancel"],
    },
  ],
  past: [
    {
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      title: "Mountain View Hostel",
      date: "Mar 5 - Mar 10, 2023",
      guests: "1 Adult",
      room: "Dormitory Bed",
      status: "Completed",
      price: 225,
      actions: ["Book Again", "Review"],
    },
  ],
  cancelled: [],
};

export default function Bookings() {
  const [tab, setTab] = useState("upcoming");
  const list = dummyBookings[tab];

  return (
    <div className={styles.page}>
      <SectionTitle
        title="My Bookings"
        subtitle="Manage your upcoming and past reservations"
      />
      <div className={styles.tabGroup}>
        {["upcoming", "past", "cancelled"].map((key) => (
          <button
            key={key}
            className={`${styles.tab} ${tab === key ? styles.active : ""}`}
            onClick={() => setTab(key)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className={styles.empty}>
          <FaCalendarTimes className={styles.emptyIcon} />
          <h3>No {tab.charAt(0).toUpperCase() + tab.slice(1)} Bookings</h3>
          <p>You don't have any {tab} bookings.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {list.map((b, i) => (
            <div key={i} className={styles.cardWrapper}>
              <div className={`${styles.card} neo-embed`}>
                <img src={b.image} alt={b.title} className={styles.image} />
                <div className={styles.info}>
                  <h3>{b.title}</h3>
                  <div className={styles.meta}>
                    <span>
                      <FaCalendarAlt /> {b.date}
                    </span>
                    <span>
                      <FaUser /> {b.guests}
                    </span>
                    <span>
                      <FaBed /> {b.room}
                    </span>
                  </div>
                  <span
                    className={`${styles.status} ${styles["status_" + b.status.toLowerCase()]}`}
                  >
                    {b.status}
                  </span>
                </div>
                <div className={styles.footer}>
                  <div className={styles.price}>${b.price}</div>
                  <div className={styles.actions}>
                    {b.actions.map((a) => (
                      <button
                        key={a}
                        className={`${styles.actionBtn} ${a.toLowerCase() === "cancel" ? styles.btnCancel : styles.btnModify}`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
