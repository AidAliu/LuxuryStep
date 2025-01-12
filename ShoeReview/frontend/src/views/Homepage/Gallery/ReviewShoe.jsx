import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";

const ReviewShoe = () => {
  const { ShoeID } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [shoe, setShoe] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  const isLoggedIn = localStorage.getItem("accessToken");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/api/me/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => setError("Failed to fetch user info."));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const [shoeRes, reviewsRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/shoes/${ShoeID}/`, { headers }),
          axios.get(`http://127.0.0.1:8000/api/shoes/${ShoeID}/reviews/`, { headers }),
        ]);
        setShoe(shoeRes.data);
        setReviews(reviewsRes.data);
      } catch {
        setError("Failed to load shoe details or reviews.");
      }
    };
    fetchData();
  }, [ShoeID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("You need to be logged in to leave a review!");
      navigate("/login");
      return;
    }
    try {
      const payload = { Shoe: ShoeID, rating, comment };
      await axios.post(
        `http://127.0.0.1:8000/api/reviews/`,
        payload,
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      );
      const updatedReviews = await axios.get(
        `http://127.0.0.1:8000/api/shoes/${ShoeID}/reviews/`
      );
      setReviews(updatedReviews.data);
      setRating(0);
      setComment("");
      alert("Review submitted successfully!");
    } catch {
      setError("An error occurred while submitting the review.");
    }
  };

  const deleteReview = async (reviewID) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://127.0.0.1:8000/api/reviews/${reviewID}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews((prev) => prev.filter((r) => r.ReviewID !== reviewID));
      alert("Review deleted successfully!");
    } catch {
      setError("Failed to delete the review. Please try again.");
    }
  };

  const calculateAverageRating = () => {
    if (!reviews.length) return 0;
    const validRatings = reviews.filter((r) => r.rating >= 1 && r.rating <= 5);
    const totalRating = validRatings.reduce((sum, r) => sum + r.rating, 0);
    return validRatings.length ? (totalRating / validRatings.length).toFixed(1) : 0;
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Review Shoe</h1>
      {error && <div className="alert alert-danger text-center">{error}</div>}
      
      {shoe && (
        <div className="text-center mb-4">
          <img
            src={`http://127.0.0.1:8000${shoe.image_url}`}
            alt={shoe.name || "Shoe"}
            className="img-fluid rounded shadow"
            style={{ maxWidth: "300px", objectFit: "cover" }}
          />
          <h2 className="mt-3">{shoe.name}</h2>
          <p>{shoe.description || "No description available."}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-4 text-center">
          <label className="form-label">Your Rating:</label>
          <div>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={30}
                color={star <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="comment">Your Comment:</label>
          <textarea
            id="comment"
            className="form-control"
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

      <div className="text-center my-5">
        <h3>Average Rating: {calculateAverageRating()} / 5</h3>
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={25}
              color={star <= Math.round(calculateAverageRating()) ? "#ffc107" : "#e4e5e9"}
            />
          ))}
        </div>
      </div>

      <div>
        <h3>Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to leave a review!</p>
        ) : (
          <ul className="list-group">
            {reviews.map((review) => (
              <li key={review.ReviewID} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={20}
                      color={star <= review.rating ? "#ffc107" : "#e4e5e9"}
                    />
                  ))}
                  <p className="mb-1"><strong>Comment:</strong> {review.comment}</p>
                  <p className="text-muted mb-0"><strong>By:</strong> {review.User.username}</p>
                </div>
                {user?.id === review.User.id && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteReview(review.ReviewID)}
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ReviewShoe;
