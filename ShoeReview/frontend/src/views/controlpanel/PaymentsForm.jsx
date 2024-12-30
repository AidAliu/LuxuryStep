import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentsForm = () => {
  const { PaymentID } = useParams(); // Get the ID from the URL (if any)
  const navigate = useNavigate();

  const [paymentData, setPaymentData] = useState({
    amount: "",
    payment_date: "",
    payment_method: "",
    Order: "",
    User: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing payment data if PaymentID is present
  useEffect(() => {
    if (PaymentID) {
      const fetchPayment = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("No access token found.");
          return;
        }

        setLoading(true);
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/payments/${PaymentID}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setPaymentData(response.data); // Populate form with existing data
          setLoading(false);
        } catch (err) {
          console.error("Error fetching payment details:", err);
          setError("Failed to load payment details");
          setLoading(false);
        }
      };

      fetchPayment();
    }
  }, [PaymentID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prevData) => ({ ...prevData, [name]: value }));
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

      if (PaymentID) {
        // Update existing payment (partial update allowed)
        await axios.put(
          `http://127.0.0.1:8000/api/payments/${PaymentID}`,
          paymentData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Payment updated successfully!");
      } else {
        // Create new payment
        await axios.post(`http://127.0.0.1:8000/api/payments`, paymentData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Payment created successfully!");
      }

      navigate("/payments"); // Redirect to payments list
    } catch (err) {
      console.error("Error saving payment:", err);
      setError("Failed to save payment");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>{PaymentID ? "Edit Payment" : "Create Payment"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            className="form-control"
            id="amount"
            name="amount"
            value={paymentData.amount}
            onChange={handleChange}
            required={!PaymentID} // Required only when creating a new payment
          />
        </div>
        <div className="form-group">
          <label htmlFor="payment_date">Payment Date</label>
          <input
            type="date"
            className="form-control"
            id="payment_date"
            name="payment_date"
            value={paymentData.payment_date}
            onChange={handleChange}
            required={!PaymentID}
          />
        </div>
        <div className="form-group">
          <label htmlFor="payment_method">Payment Method</label>
          <input
            type="text"
            className="form-control"
            id="payment_method"
            name="payment_method"
            value={paymentData.payment_method}
            onChange={handleChange}
            required={!PaymentID}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Order">Order</label>
          <input
            type="text"
            className="form-control"
            id="Order"
            name="Order"
            value={paymentData.Order}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="User">User</label>
          <input
            type="text"
            className="form-control"
            id="User"
            name="User"
            value={paymentData.User}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {PaymentID ? "Update Payment" : "Create Payment"}
        </button>
      </form>
    </div>
  );
};

export default PaymentsForm;
