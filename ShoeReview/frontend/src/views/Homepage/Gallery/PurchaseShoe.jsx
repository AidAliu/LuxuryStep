import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const PurchaseShoe = () => {
  const { OrderID } = useParams();
  const navigate = useNavigate();
  const [shoeDetails, setShoeDetails] = useState(null);
  const [order, setOrder] = useState(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/orders/${OrderID}/`);
        setOrder(response.data);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [OrderID]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shippingAddress) {
      setError("Shipping address is required.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("No access token found.");
      return;
    }

    setLoading(true);

    try {
      console.log("Shipping Address:", shippingAddress); // Debugging log
      const response = await axios.post(
        `http://127.0.0.1:8000/api/orders/${OrderID}/purchase/`,
        { shipping_address: shippingAddress },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Purchase successful! Your order is now complete.");
      setOrder(null);
      navigate("/"); 
    } catch (err) {
      console.error("Error completing purchase:", err);
      setError(err.response?.data?.error || "An error occurred while completing the purchase.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading order details...</p>;
  }

  if (!order) {
    return <p>No order details found.</p>;
  }

  return (
    <div className="purchase-container">
      <h1>Purchase Shoe</h1>
      <div className="order-details">
        <h3>Order Summary</h3>
        {order.items?.map((item) => (
          <div key={item.id} className="order-item">
            <p>Shoe: {item.shoe?.name || "Unknown"}</p>
            <p>Brand: {item.shoe?.brand || "Unknown"}</p>
            <p>Style: {item.shoe?.style || "Unknown"}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${item.price}</p>
          </div>
        ))}
        <h3>Total: ${order.total_price || 0}</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="shippingAddress">Shipping Address:</label>
          <input
            type="text"
            id="shippingAddress"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="Enter your shipping address"
            required
          />
        </div>
        <button type="submit" disabled={loading}>Complete Purchase</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default PurchaseShoe;
