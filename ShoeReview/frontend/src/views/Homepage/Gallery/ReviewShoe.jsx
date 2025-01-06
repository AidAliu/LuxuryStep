import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";

const ReviewShoe = () => {
  const { ShoeID } = useParams();
  const navigate = useNavigate();

  const [shoe, setShoe] = useState(null); // Shoe details
  const [rating, setRating] = useState(0); // Numeric rating
  const [hover, setHover] = useState(null); // For star hover
  const [comment, setComment] = useState(""); // Review comment
  const [reviews, setReviews] = useState([]); // Existing reviews
  const [error, setError] = useState(null); // Error messages

  const isLoggedIn = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchShoeData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
        const shoeResponse = await axios.get(
          `http://127.0.0.1:8000/api/shoes/${ShoeID}/`,
          { headers }
        );
  
        const reviewsResponse = await axios.get(
          `http://127.0.0.1:8000/api/shoes/${ShoeID}/reviews/`,
          { headers }
        );
  
        setShoe(shoeResponse.data);
        setReviews(reviewsResponse.data);
      } catch (err) {
        setError("Failed to load shoe details or reviews.");
        console.error(err);
      }
    };
  
    fetchShoeData();
  }, [ShoeID]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("You need to be logged in to leave a review!");
      navigate("/login");
      return;
    }

    try {
      const payload = {
        Shoe: ShoeID,
        rating,
        comment,
      };

      await axios.post(
        `http://127.0.0.1:8000/api/reviews/`,
        payload,
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      );

      // Refresh reviews after successful submission
      const updatedReviews = await axios.get(`http://127.0.0.1:8000/api/shoes/${ShoeID}/reviews/`);
      setReviews(updatedReviews.data);
      setRating(0); // Reset rating
      setComment(""); // Reset comment
      alert("Review submitted successfully!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "An error occurred while submitting the review.");
    }
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Review Shoe</h1>
      {error && <p className="text-danger">{error}</p>}

      {shoe && (
        <div className="text-center mb-4">
          <img
            src={shoe.image_url || "http://127.0.0.1:8000/media/default_image.jpg"}
            alt={shoe.name || "Shoe Image"}
            className="img-fluid rounded"
            style={{ maxWidth: "300px", maxHeight: "300px", objectFit: "cover" }}
          />
          <h2 className="mt-3">{shoe.name}</h2>
          <p>{shoe.description || "No description available."}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="text-center mb-3">
          <label htmlFor="rating" className="form-label">
            Rating:
          </label>
          <div>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={30}
                className="mx-1"
                color={star <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </div>
          {rating > 0 && <p className="mt-2">You rated this {rating} out of 5.</p>}
        </div>
        <div className="form-group">
          <label htmlFor="comment">Comment:</label>
          <textarea
            className="form-control"
            id="comment"
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Submit Review
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
                <div>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={20}
                      color={star <= review.rating ? "#ffc107" : "#e4e5e9"}
                    />
                  ))}
                </div>
                <strong>Comment:</strong> {review.comment}
                <br />
                <strong>By:</strong> {review.User.username}
              </li>
            ))}
          </ul>
        )}
        <div className="text-center mt-4">
          <button className="btn btn-link" onClick={() => navigate("/")}>
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewShoe;
