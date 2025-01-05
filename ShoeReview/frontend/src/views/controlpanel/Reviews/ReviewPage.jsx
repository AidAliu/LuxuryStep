import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ReviewPage = () => {
  const [Reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No access token found.");
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/reviews/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(response.data);
      } catch (err) {
        console.error("Error fetching Reviews:", err);
        setError("Failed to load Reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDelete = async (ReviewID) => {

    const confirmDelete = window.confirm('Are you sure you want to delete this Review?')
    if (!confirmDelete) {
        return;
    }



    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("No access token found.");
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/reviews/${ReviewID}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(Reviews.filter((Review) => Review.ReviewID !== ReviewID));
      alert("Review deleted successfully!");
    } catch (err) {
      console.error("Error deleting Review:", err);
      alert("Failed to delete Review");
    }
  };

  const handleEdit = (ReviewID) => {
    navigate(`/reviews/edit/${ReviewID}`);
  };

  const handleAdd = () => {
    navigate(`/reviews/new`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h1>Reviews</h1>
      <button className="btn btn-primary mb-3" onClick={handleAdd}>
        Add New Review
      </button>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Shoe</th>
              <th>rating</th>
              <th>comment</th>
            </tr>
          </thead>
          <tbody>
            {Reviews.map((Review) => (
              <tr key={Review.ReviewID}>
                <td>{Review.ReviewID}</td>
                <td>{Review.User?.username || "Unknown User"}</td>
                <td>{Review.Shoe}</td>
                <td>{Review.rating}</td>
                <td>{Review.comment}</td>
                <td>
                  <button
                    className="btn btn-warning mx-1"
                    onClick={() => handleEdit(Review.ReviewID)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger mx-1"
                    onClick={() => handleDelete(Review.ReviewID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewPage;
