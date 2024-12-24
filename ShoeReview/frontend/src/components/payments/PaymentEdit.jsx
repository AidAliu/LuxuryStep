import React, { useEffect, useState } from 'react';
import { updatePayment, getPayments } from '../../utils/paymentApi';
import { useParams, useNavigate } from 'react-router-dom';

export const PaymentEdit = () => {
  const { id } = useParams();       // paymentId from URL
  const navigate = useNavigate();

  const [orderID, setOrderID] = useState('');
  const [userID, setUserID] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    fetchPaymentDetails();
    // eslint-disable-next-line
  }, []);

  const fetchPaymentDetails = async () => {
    try {
      // We'll reuse getPayments() but filter on the client side 
      // or you can implement getPaymentById if you have an endpoint for a single Payment
      const allPayments = await getPayments();
      const existingPayment = allPayments.find((p) => p.PaymentID === parseInt(id));
      if (existingPayment) {
        setOrderID(existingPayment.OrderID);
        setUserID(existingPayment.UserID);
        setAmount(existingPayment.amount);
        setPaymentMethod(existingPayment.paymentMethod);
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        OrderID: orderID,
        UserID: userID,
        amount: parseFloat(amount),
        paymentMethod: paymentMethod
      };
      await updatePayment(id, updatedData);
      alert('Payment updated successfully!');
      navigate('/payments');
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Edit Payment (ID: {id})</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Order ID: </label>
          <input
            type="number"
            value={orderID}
            onChange={(e) => setOrderID(e.target.value)}
            required
          />
        </div>
        <div>
          <label>User ID: </label>
          <input
            type="number"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Amount: </label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Payment Method: </label>
          <input
            type="text"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>
          Update
        </button>
      </form>
    </div>
  );
};
