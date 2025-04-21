import React from "react";
import styles from "./Footer.module.css";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.content}>
      {/* Brand & Social */}
      <div className={styles.column}>
        <h3>TripMeUp</h3>
        <p>
          Your trusted partner in discovering and booking the best travel
          experiences around the globe.
        </p>
      
      </div>

      {/* Quick Links */}
      <div className={styles.column}>
        <h3>Quick Links</h3>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/cities">Cities</Link></li>
          <li><Link to="/restaurants">Restaurants</Link></li>
          <li><Link to="/accommodations">Accommodations</Link></li>
          <li><Link to="/bookings">My Bookings</Link></li>
          <li><Link to="/favorites">Favorites</Link></li>
        </ul>
      </div>

      {/* Support */}
      {/* <div className={styles.column}>
        <h3>Support</h3>
        <ul>
          <li><Link to="/help">Help Center</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/privacy">Privacy Policy</Link></li>
          <li><Link to="/terms">Terms of Service</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
        </ul>
      </div> */}

      {/* Contact Info */}
      <div className={styles.column}>
        <h3>Contact</h3>
        <ul className={styles.contactList}>
          <li><FaMapMarkerAlt className={styles.icon} /> Hull Estate, Suite 1602</li>
          <li><FaPhoneAlt className={styles.icon} /> +1 (555) 123-4567</li>
          <li><FaEnvelope className={styles.icon} /> info@tripmeup.com</li>
        </ul>
      </div>
    </div>

    <div className={styles.copy}>
      © {new Date().getFullYear()} TripMeUp. All rights reserved.
    </div>
  </footer>
);

export default Footer;
