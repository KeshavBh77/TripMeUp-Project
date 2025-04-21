import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Hero.module.css";
import heroImg from "../../assets/images/hero.png";
import SearchBar from "../SearchBar/SearchBar";

const Hero = () => {
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("http://localhost:8000/TripMeUpApp/city/");
        const data = await response.json();

        const transformed = data.map(city => ({
          title: city.name,
          description: city.location,
          image: city.image_url || "default-image.jpg",
          original: city,
        }));

        setCities(transformed);
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };

    fetchCities();
  }, []);

  const handleSearchSelect = (item) => {
    if (item?.label) {
      navigate(`/cities/${item.label.toLowerCase()}`);
    }
  };

  return (
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
        <SearchBar
          suggestions={cities.map(c => ({
            label: c.title,
            image: c.image,
            original: c
          }))}
          onSearch={() => {}} // Optional — can be no-op if not filtering anything
          onSelect={handleSearchSelect}
        />
      </div>
    </section>
  );
};

export default Hero;
