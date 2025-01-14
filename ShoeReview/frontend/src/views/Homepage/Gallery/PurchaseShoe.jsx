import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const PurchaseShoe = () => {
  const { OrderID } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState("");
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
      await axios.put(
        `http://127.0.0.1:8000/api/orders/${OrderID}/`,
        { shipping_address: shippingAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const paymentData = {
        payment_method: payment,
        amount: order.total_price,
        OrderID: OrderID,
        shipping_address: shippingAddress,
      };

      await axios.post(
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
        <div className="card-container">
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
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
          <div className="form-group mt-3">
            <label htmlFor="cardName">Cardholder Name</label>
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
          <div className="row mt-3">
            <div className="col-md-6 form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
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
            <div className="col-md-6 form-group">
              <label htmlFor="cvv">CVV</label>
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
        <div className="card-container">
          <div className="form-group">
            <label htmlFor="paypalEmail">PayPal Email</label>
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
  
  const styles = {
    purchaseContainer: {
      maxWidth: '800px',
      margin: '30px auto',
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    },
    heading: {
      textAlign: 'center',
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '25px',
      color: '#343a40',
    },
    orderDetails: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px',
      justifyContent: 'space-around',
      marginBottom: '20px',
    },
    orderItem: {
      width: '100px',
      textAlign: 'center',
      marginBottom: '10px',
    },
    orderItemImg: {
      width: '150px',
      height: '150px',
      objectFit: 'cover',
      borderRadius: '8px',
      marginBottom: '5px',
    },
    orderItemText: {
      fontSize: '0.9rem',
      fontWeight: '500',
      color: '#495057',
    },
    button: {
      backgroundColor: '#007bff',
      color: 'white',
      fontWeight: 'bold',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
  };

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>No order details found.</p>;

  return (
    <div style={styles.purchaseContainer}>
      <h2 style={styles.heading}>Purchase Shoe</h2>
      <div style={styles.orderDetails}>
        {order.items.map((item) => (
          <div key={item.Shoe} style={styles.orderItem}>
            <img
              src={`http://127.0.0.1:8000${shoeDetails[item.Shoe]?.image_url}`}
              alt={shoeDetails[item.Shoe]?.name}
              style={styles.orderItemImg}
            />
            <p style={styles.orderItemText}>{shoeDetails[item.Shoe]?.name}</p>
            <p style={styles.orderItemText}>Qty: {item.quantity}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="shippingAddress">Shipping Address</label>
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
        <div className="form-group mt-4">
          <label htmlFor="payment">Payment Method</label>
          <select
            id="payment"
            className="form-control"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            required
          >
            <option value="">Select Payment Method</option>
            <option value="Card">Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Cash">Cash</option>
          </select>
        </div>
        {renderPaymentForm()}
        {error && <div className="error-message mt-3">{error}</div>}
        <button
          type="submit"
          className="btn btn-primary mt-4 w-100"
          disabled={loading}
        >
          {loading ? "Processing..." : "Complete Purchase"}
        </button>
      </form>
    </div>
  );
};

export default PurchaseShoe;
