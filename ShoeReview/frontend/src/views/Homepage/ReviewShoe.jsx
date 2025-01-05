import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ReviewShoe = () => {
  const { ShoeID } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]); // State to store reviews
  const [error, setError] = useState(null);

  // Fetch reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/shoes/${ShoeID}/reviews/`);
        setReviews(response.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews.");
      }
    };

    fetchReviews();
  }, [ShoeID]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("No access token found.");
      return;
    }

    try {
      const payload = {
        Shoe: ShoeID,
        rating: rating,
        comment: comment,
      };

      await axios.post(`http://127.0.0.1:8000/api/reviews/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Review created successfully!");

      // Refresh the reviews after successful submission
      const response = await axios.get(`http://127.0.0.1:8000/api/shoes/${ShoeID}/reviews/`);
      setReviews(response.data);

    } catch (err) {
      console.error("Error saving Review:", err);
      setError(err.response?.data?.error || "An error occurred while submitting the review.");
    }
  };

  return (
    <div className="container">
      <h1>Leave A Review</h1>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="rating" className="form-label">
            Rating
          </label>
          <select
            className="form-control"
            id="rating"
            name="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          >
            <option value="">Select</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="comment">Comment</label>
          <input
            type="text"
            className="form-control"
            id="comment"
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit review
        </button>
      </form>

      <div className="mt-5">
        <h2>Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to leave a review!</p>
        ) : (
          <ul className="list-group">
            {reviews.map((review) => (
              <li key={review.id} className="list-group-item">
                <strong>Rating:</strong> {review.rating} / 5
                <br />
                <strong>Comment:</strong> {review.comment}
                <br />
                <strong>By:</strong> {review.User.username}
              </li>
            ))}
          </ul>
        )}
        <div className="text-center mt-4">
          <button className="btn btn-link" onClick={() => navigate('/')}>
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
    
  );
  
};

export default ReviewShoe;
