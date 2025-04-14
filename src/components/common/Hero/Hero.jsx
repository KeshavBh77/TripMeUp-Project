import React from 'react';
import './Hero.css';

const Hero = ({ title, subtitle, ctaText }) => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
        <button className="btn btn-primary hero-cta">{ctaText}</button>
      </div>
    </section>
  );
};

export default Hero;