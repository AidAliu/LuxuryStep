import React, { useEffect, useState } from 'react';
import { getPayments, deletePayment } from '../../utils/paymentApi';
import { Link } from 'react-router-dom';

export const PaymentList = () => {
  const [payments, setPayments] = useState([]);

  // Fetch payments on component mount
  useEffect(() => {
    fetchAllPayments();
  }, []);

  const fetchAllPayments = async () => {
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleDelete = async (paymentId) => {
    try {
      await deletePayment(paymentId);
      fetchAllPayments(); // refresh after deleting
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Payments</h2>
      <Link to="/payments/new" style={{ marginBottom: '10px', display: 'inline-block' }}>
        Create New Payment
      </Link>
      <ul>
        {payments.map((payment) => (
          <li key={payment.PaymentID}>
            <strong>PaymentID:</strong> {payment.PaymentID}
            {' | '}
            <strong>Amount:</strong> {payment.amount}
            {' | '}
            <strong>Method:</strong> {payment.paymentMethod}
            {' | '}
            <button onClick={() => handleDelete(payment.PaymentID)} style={{ marginLeft: '10px' }}>
              Delete
            </button>
            {' | '}
            <Link to={`/payments/edit/${payment.PaymentID}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
