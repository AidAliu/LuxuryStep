import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const PurchaseShoe = () => {
  const { OrderID } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState();
  const [order, setOrder] = useState(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch order details when component mounts
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

  // Handle form submission for purchase
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shippingAddress || !payment) {
      setError("Shipping address and payment method are required.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("No access token found.");
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        payment_method: payment,
        amount: order.total_price,
        OrderID: OrderID,
        shipping_address: shippingAddress,
      };

      console.log("Payment Data to be sent:", paymentData);

      // Update the order with the shipping address
      await axios.put(
        `http://127.0.0.1:8000/api/orders/${OrderID}/`,
        { shipping_address: shippingAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Create a payment record
      const response = await axios.post(
        `http://127.0.0.1:8000/api/paymentsapi/`,
        paymentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Purchase successful! Your order is now complete.");

      // Optionally redirect or handle response
      if (response.data.new_order_id) {
        console.log("New Order ID:", response.data.new_order_id);
        navigate(`/cart`);
      } else {
        navigate("/");
      }
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
        {order.items?.length > 0 ? (
          order.items.map((item) => (
            <div key={item.id} className="order-item">
              <p>Shoe: {item.Shoe?.name || "Unknown"}</p>
              <p>Brand: {item.Shoe?.BrandID || "Unknown"}</p>
              <p>Style: {item.Shoe?.StyleID || "Unknown"}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price}</p>
            </div>
          ))
        ) : (
          <p>No items in this order.</p>
        )}
        <h3>Total: ${order.total_price || 0}</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="shippingAddress">Shipping Address:</label>
          <input
            type="text"
            id="shippingAddress"
            value={shippingAddress}
            onChange={(e) => {
              setShippingAddress(e.target.value);
              setError(""); // Clear error on change
            }}
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
            value={payment || ""}
            onChange={(e) => {
              setPayment(e.target.value);
              setError(""); // Clear error on change
            }}
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
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Complete Purchase"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default PurchaseShoe;
