import React from 'react';
import './Card.css';

const Card = ({ title, description, imageUrl }) => {
  return (
    <div className="card">
      <div className="card-image">
        <img src={imageUrl} alt={title} />
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <button className="btn btn-primary">Explore</button>
      </div>
    </div>
  );
};

export default Card;