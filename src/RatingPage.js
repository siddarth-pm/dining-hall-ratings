// RatingPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './RatingPage.css';

const RatingPage = () => {
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [reviewRating, setReviewRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);

  const idToName = new Map([
    [1, 'College Nine/John R. Lewis'],
    [2, 'Cowell/Stevenson'],
    [3, 'Crown/Merrill'],
    [4, 'Porter/Kresge'],
    [5, 'Rachel Carson/Oakes']
  ]);


  useEffect(() => {
    fetchReviews();
  }, []);

  const deleteAllRatings = async () => {
    try {
      await fetch('http://localhost:5000/api/ratings', {
        method: 'DELETE',
      });
      fetchReviews();
    } catch (error) {
      console.error('Error deleting ratings:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/ratings/${id}`);
      if (!response.ok) {
        throw new Error('Error fetching reviews');
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error.message);
      // Log the error stack trace for more details
      console.error('Error stack trace:', error.stack);
    }
  };

  const handleRatingHover = (index) => {
    setRating(index + 1);
  };

  const handleRatingClick = (index) => {
    setReviewRating(index + 1);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (reviewRating === 0) {
      alert('Please select a rating before submitting.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          diningHallId: parseInt(id),
          rating: reviewRating,
          review,
        }),
      });

      if (response.ok) {
        setReviewRating(0);
        setReview('');
        setRating(0);
        fetchReviews();
      } else {
        console.error('Error submitting rating:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <div className="rating-page">
      <h1>{idToName.get(parseInt(id))}</h1>
      <div className="rating-form">
        <div className="rating">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={`star ${index < rating ? 'filled' : ''}`}
              onMouseEnter={() => handleRatingHover(index)}
              onMouseLeave={() => setRating(reviewRating)}
              onClick={() => handleRatingClick(index)}
            >
              &#9733;
            </span>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Write a review..."
            value={review}
            onChange={handleReviewChange}
          ></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="reviews">
        {reviews.map((review) => (
          <div key={review._id} className="review">
            <div className="rating">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`star ${index < review.rating ? 'filled' : ''}`}
                >
                  &#9733;
                </span>
              ))}
            </div>
            <p>{review.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingPage;