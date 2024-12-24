import React, { useState } from 'react';
import { createPayment } from '../../utils/paymentApi';
import { useNavigate } from 'react-router-dom';

export const PaymentCreate = () => {
  const navigate = useNavigate();

  const [orderID, setOrderID] = useState('');
  const [userID, setUserID] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Build the request body
      const newPayment = {
        OrderID: orderID,
        UserID: userID,
        amount: parseFloat(amount),
        paymentMethod: paymentMethod
      };

      await createPayment(newPayment);
      alert('Payment created successfully!');
      navigate('/payments'); // redirect back to list
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create Payment</h2>
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
          Create
        </button>
      </form>
    </div>
  );
};
