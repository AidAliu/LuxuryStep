import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const PurchaseShoe = () => {
  const { OrderID } = useParams();
  const navigate = useNavigate();
  const [shoeDetails, setShoeDetails] = useState(null);
  const [payment, setPayment] = useState();
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
  
    if (!payment) {
      setError("Payment method is required.");
      return;
    }
  
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("No access token found.");
      return;
    }
  
    setLoading(true);
  
    try {
      // Log the data that will be sent to the backend
      const paymentData = {
        payment_method: payment, // Payment method selected
        amount: order.total_price, // Total amount from the order
        Order: OrderID, // Order ID
      };
      console.log("Payment Data to be sent:", paymentData);
  
      // Update the order with the shipping address
      await axios.put(
        `http://127.0.0.1:8000/api/orders/${OrderID}/`,
        { shipping_address: shippingAddress },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Create a payment record
      await axios.post(
        `http://127.0.0.1:8000/api/paymentsapi/`,
        paymentData, // Send the payment data without 'User'
        {
          headers: { Authorization: `Bearer ${token}` },  // Ensure the token is passed here
        }
      );
  
      alert("Purchase successful! Your order is now complete.");
      setOrder(null);
      navigate("/"); // Redirect to home or another page
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
          <div key={item.OrderID} className="order-item">
            <p>Shoe: {item.Shoe?.name || "Unknown"}</p>
            <p>Brand: {item.Shoe?.BrandID || "Unknown"}</p>
            <p>Style: {item.Shoe?.StyleID || "Unknown"}</p>
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
        <div className="form-group">
  <label htmlFor="payment_method">Payment Method:</label>
  <select
    className="form-control"
    id="payment_method"
    name="payment_method"
    value={payment || ""} // Use payment state or default to an empty string
    onChange={(e) => setPayment(e.target.value)} // Update the payment state on change
    required
  >
    <option value="" disabled>
      Select Payment Method
    </option>
    <option value="Card">Card</option>
    <option value="PayPal">PayPal</option>
    <option value="Cash">Cash</option>
  </select>
</div>

        <button type="submit" disabled={loading}>Complete Purchase</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default PurchaseShoe;
