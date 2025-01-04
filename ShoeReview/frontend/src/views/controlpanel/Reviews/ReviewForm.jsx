import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ReviewForm = () => {
  const { ReviewID } = useParams(); 
  const navigate = useNavigate();

  const [ReviewData, setReviewData] = useState({
    Shoe: "",
    rating: "",
    comment: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing Review data if ReviewID is present
  useEffect(() => {
    if (ReviewID) {
      const fetchReview = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("No access token found.");
          return;
        }

        setLoading(true);
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/reviews/${ReviewID}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setReviewData(response.data);
        } catch (err) {
          console.error("Error fetching Review details:", err);
          setError("Failed to load Review details");
        } finally {
          setLoading(false);
        }
      };
      fetchReview();
    }
  }, [ReviewID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("No access token found.");
      return;
    }
  
    try {
      setLoading(true);
  
      const payload = {
        Shoe: ReviewData.Shoe, // Ensure this is an ID
        rating: ReviewData.rating,
        comment: ReviewData.comment,
      };
  
      if (ReviewID) {
        await axios.put(
          `http://127.0.0.1:8000/api/reviews/${ReviewID}/`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Review updated successfully!");
      } else {
        await axios.post(`http://127.0.0.1:8000/api/reviews/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Review created successfully!");
      }
  
      navigate("/reviews"); // Redirect to Reviews list
    } catch (err) {
      console.error("Error saving Review:", err);
      setError("Failed to save Review");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h1>{ReviewID ? "Edit Review" : "Create Review"}</h1>
      <form onSubmit={handleSubmit}>
       
        <div className="form-group">
          <label htmlFor="description">Shoe</label>
          <input
            type="number"
            className="form-control"
            id="Shoe"
            name="Shoe"
            value={ReviewData.Shoe.ShoeID}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="website_url">Rating</label>
          <input
            type="number"
            className="form-control"
            id="rating"
            name="rating"
            value={ReviewData.rating}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="website_url">Comment</label>
          <input
            type="text"
            className="form-control"
            id="comment"
            name="comment"
            value={ReviewData.comment}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {ReviewID ? "Update Review" : "Create Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
