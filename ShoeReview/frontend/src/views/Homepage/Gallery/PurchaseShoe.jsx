import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PurchaseShoe = () => {
  const { ShoeID } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [purchases, setPurchases] = useState([]); // State to store purchase history
  const [error, setError] = useState(null);

  // Fetch purchase history on component mount
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/shoes/${ShoeID}/purchases/`);
        setPurchases(response.data);
      } catch (err) {
        console.error("Error fetching purchases:", err);
        setError("Failed to load purchase history.");
      }
    };

    fetchPurchases();
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
        quantity: quantity,
      };

      await axios.post(`http://127.0.0.1:8000/api/purchases/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Purchase successful!");

      // Refresh the purchase history after successful submission
      const response = await axios.get(`http://127.0.0.1:8000/api/shoes/${ShoeID}/purchases/`);
      setPurchases(response.data);

    } catch (err) {
      console.error("Error making purchase:", err);
      setError(err.response?.data?.error || "An error occurred while processing the purchase.");
    }
  };

  return (
    <div className="container">
      <h1>Purchase Shoe</h1>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="quantity" className="form-label">
            Quantity
          </label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Purchase
        </button>
      </form>

      <div className="mt-5">
        <h2>Purchase History</h2>
        {purchases.length === 0 ? (
          <p>No purchases yet. Be the first to purchase this shoe!</p>
        ) : (
          <ul className="list-group">
            {purchases.map((purchase) => (
              <li key={purchase.id} className="list-group-item">
                <strong>Quantity:</strong> {purchase.quantity}
                <br />
                <strong>Date:</strong> {new Date(purchase.created_at).toLocaleDateString()}
                <br />
                <strong>By:</strong> {purchase.User.username}
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

export default PurchaseShoe;
