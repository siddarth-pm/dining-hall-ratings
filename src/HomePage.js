// HomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [diningHalls, setDiningHalls] = useState([
    { id: 1, name: 'College Nine/John R. Lewis', rating: 0 },
    { id: 2, name: 'Cowell/Stevenson', rating: 0 },
    { id: 3, name: 'Crown/Merrill', rating: 0 },
    { id: 4, name: 'Porter/Kresge', rating: 0 },
    { id: 5, name: 'Rachel Carson/Oakes', rating: 0 },
  ]);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const updatedDiningHalls = await Promise.all(
        diningHalls.map(async (diningHall) => {
          const response = await fetch(`http://localhost:5000/api/ratings/${diningHall.id}`);
          const ratings = await response.json();
          const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
          const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;
          return { ...diningHall, rating: averageRating };
        })
      );
      setDiningHalls(updatedDiningHalls);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const handleDiningHallClick = (id) => {
    navigate(`/rating/${id}`);
  };

  return (
    <div className="homepage">
      <h1>Dining Hall Ratings</h1>
      <div className="dining-hall-list">
        {diningHalls.map((diningHall) => (
          <div
            key={diningHall.id}
            className="dining-hall-item"
            onClick={() => handleDiningHallClick(diningHall.id)}
          >
            <h2>{diningHall.name}</h2>
            <div className="rating">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`star ${index < Math.floor(diningHall.rating) ? 'filled' : ''}`}
                >
                  &#9733;
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;