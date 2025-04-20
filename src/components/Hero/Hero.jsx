// src/components/Hero/Hero.jsx
import React from "react";
import styles from "./Hero.module.css";
import heroImg from "../../assets/images/hero.png";
import SearchBar from "../SearchBar/SearchBar";

const Hero = () => (
  <section className={styles.hero}>
    <div
      className={styles.overlay}
      style={{ backgroundImage: `url(${heroImg})` }}
    />
    <div className={styles.content}>
      <h1>Discover Amazing Places Around the World</h1>
      <p>
        Find and book the best restaurants and accommodations for your next
        adventure
      </p>
      <SearchBar />
    </div>
  </section>
);

export default Hero;
