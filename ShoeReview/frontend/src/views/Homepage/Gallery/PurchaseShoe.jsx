import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const PurchaseShoe = () => {
  const { OrderID } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState();
  const [order, setOrder] = useState(null);
  const [shoeDetails, setShoeDetails] = useState({});
  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    paypalEmail: "",
  });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Authorization token missing");

        const response = await axios.get(
          `http://127.0.0.1:8000/api/orders/${OrderID}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const activeOrder = response.data;
        setOrder(activeOrder);

        const detailedShoes = {};
        for (const item of activeOrder.items) {
          const shoeResponse = await axios.get(
            `http://127.0.0.1:8000/api/shoes/${item.Shoe}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          detailedShoes[item.Shoe] = shoeResponse.data;
        }

        setShoeDetails(detailedShoes);
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

    if (!shippingAddress || !payment) {
      setError("Shipping address and payment method are required.");
      return;
    }

    if (
      (payment === "Card" && !paymentDetails.cardNumber) ||
      (payment === "PayPal" && !paymentDetails.paypalEmail)
    ) {
      setError("Please fill in the required payment details.");
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

      await axios.put(
        `http://127.0.0.1:8000/api/orders/${OrderID}/`,
        { shipping_address: shippingAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const response = await axios.post(
        `http://127.0.0.1:8000/api/paymentsapi/`,
        paymentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Purchase successful! Your order is now complete.");
      navigate("/");
    } catch (err) {
      console.error("Error completing purchase:", err);
      setError("An error occurred while completing the purchase.");
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentForm = () => {
    if (payment === "Card") {
      return (
        <div className="mt-3">
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number:</label>
            <input
              type="text"
              id="cardNumber"
              className="form-control"
              value={paymentDetails.cardNumber}
              onChange={(e) =>
                setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })
              }
              placeholder="Enter card number"
              required
            />
          </div>
          <div className="form-group mt-2">
            <label htmlFor="cardName">Name on Card:</label>
            <input
              type="text"
              id="cardName"
              className="form-control"
              value={paymentDetails.cardName}
              onChange={(e) =>
                setPaymentDetails({ ...paymentDetails, cardName: e.target.value })
              }
              placeholder="Enter name on card"
              required
            />
          </div>
          <div className="form-row mt-2">
            <div className="form-group col-md-6">
              <label htmlFor="expiryDate">Expiry Date:</label>
              <input
                type="text"
                id="expiryDate"
                className="form-control"
                value={paymentDetails.expiryDate}
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })
                }
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="cvv">CVV:</label>
              <input
                type="text"
                id="cvv"
                className="form-control"
                value={paymentDetails.cvv}
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, cvv: e.target.value })
                }
                placeholder="CVV"
                required
              />
            </div>
          </div>
        </div>
      );
    }

    if (payment === "PayPal") {
      return (
        <div className="mt-3">
          <div className="form-group">
            <label htmlFor="paypalEmail">PayPal Email:</label>
            <input
              type="email"
              id="paypalEmail"
              className="form-control"
              value={paymentDetails.paypalEmail}
              onChange={(e) =>
                setPaymentDetails({ ...paymentDetails, paypalEmail: e.target.value })
              }
              placeholder="Enter PayPal email"
              required
            />
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>No order details found.</p>;

  return (
    <div className="purchase-container mt-5">
      <h2 className="text-center mb-4">Purchase Shoe</h2>
      <div className="order-details">
        {order.items?.map((item) => {
          const shoe = shoeDetails[item.Shoe];
          const imageUrl = shoe?.image_url
            ? `http://127.0.0.1:8000${shoe.image_url}`
            : "http://127.0.0.1:8000/media/default_image.jpg";

          return (
            <div key={item.id} className="order-item">
              <img
                src={imageUrl}
                alt={shoe?.name || "No Name"}
                className="img-thumbnail"
              />
              <p>{shoe?.name}</p>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="shippingAddress">Shipping Address:</label>
          <input
            type="text"
            id="shippingAddress"
            className="form-control"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="Enter your shipping address"
            required
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="payment_method">Payment Method:</label>
          <select
            id="payment_method"
            className="form-control"
            value={payment || ""}
            onChange={(e) => setPayment(e.target.value)}
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
        {renderPaymentForm()}
        <button type="submit" className="btn btn-success mt-4">
          Complete Purchase
        </button>
      </form>
      {error && <p className="text-danger text-center mt-3">{error}</p>}
    </div>
  );
};

export default PurchaseShoe;
