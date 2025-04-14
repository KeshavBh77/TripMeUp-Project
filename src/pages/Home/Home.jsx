import React from 'react';
import Hero from '../../components/common/Hero/Hero';
import Card from '../../components/common/Card/Card';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Hero 
        title="Discover Amazing Places"
        subtitle="Find and book unique experiences around the world"
        ctaText="Explore Now"
      />
      
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Featured Destinations</h2>
          <div className="cards-grid">
            <Card 
              title="Paris"
              description="The city of love and lights"
              imageUrl="/images/paris.jpg"
            />
            <Card 
              title="Tokyo"
              description="Where tradition meets innovation"
              imageUrl="/images/tokyo.jpg"
            />
            <Card 
              title="New York"
              description="The city that never sleeps"
              imageUrl="/images/new-york.jpg"
            />
          </div>
        </div>
      </section>
      
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How TripMeUp Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Search</h3>
              <p>Find your perfect destination</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Book</h3>
              <p>Reserve with ease</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Enjoy</h3>
              <p>Experience your adventure</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;