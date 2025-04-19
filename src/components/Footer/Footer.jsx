import React from 'react';
import styles from './Footer.module.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => (
  <footer className={styles.footer }>
    <div className={styles.content}>
      <div className={styles.column}>
        <h3>ExploreWorld</h3>
        <p>Your trusted partner in discovering and booking the best travel experiences around the globe.</p>
        <div className={styles.social}>
          <FaFacebookF />
          <FaTwitter />
          <FaInstagram />
          <FaLinkedinIn />
        </div>
      </div>
      <div className={styles.column}>
        <h3>Quick Links</h3>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Cities</a></li>
          <li><a href="#">Restaurants</a></li>
          <li><a href="#">Accommodations</a></li>
          <li><a href="#">My Bookings</a></li>
          <li><a href="#">Favorites</a></li>
        </ul>
      </div>
      <div className={styles.column}>
        <h3>Support</h3>
        <ul>
          <li><a href="#">Help Center</a></li>
          <li><a href="#">Contact Us</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">FAQ</a></li>
        </ul>
      </div>
      <div className={styles.column}>
        <h3>Contact</h3>
        <ul>
          <li><i className="fas fa-map-marker-alt"></i> 123 Travel St, Suite 100</li>
          <li><i className="fas fa-phone"></i> +1 (555) 123-4567</li>
          <li><i className="fas fa-envelope"></i> info@exploreworld.com</li>
        </ul>
      </div>
    </div>
    <div className={styles.copy}>© 2023 ExploreWorld. All rights reserved.</div>
  </footer>
);

export default Footer;
