import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        alert('No access token found.');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/payments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Payments data:', response.data); // Log to inspect data
        setPayments(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError('Failed to load payments data');
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleDelete = async (PaymentID) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('No access token found.');
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/payments/${PaymentID}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update state to reflect the deletion
      setPayments(payments.filter((payment) => payment.PaymentID !== PaymentID));
    } catch (err) {
      console.error('Error deleting payment:', err);
      alert('Failed to delete payment');
    }
  };

  const handleAdd = () => {
    navigate('/payments/new'); // Navigate to the create payment page
  };

  const handleEdit = (PaymentID) => {
    navigate(`/payments/edit/${PaymentID}`); // Navigate to the edit payment page
  };

  if (loading) {
    return <div>Loading payments...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Payments</h1>

      {/* Add New Payment Button */}
      <button className="btn btn-primary mb-3" onClick={handleAdd}>
        Create New Payment
      </button>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              {/* Render table headers dynamically based on keys in the first payment object */}
              {payments[0] && Object.keys(payments[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={index}>
                {/* Render table cells dynamically based on values in the payment object */}
                {Object.values(payment).map((value, i) => (
                  <td key={i}>{value?.toString() || '-'}</td>
                ))}
                <td>
                  <button
                    className="btn btn-warning mx-1"
                    style={{ marginRight: '5px'}}
                    onClick={() => handleEdit(payment.PaymentID)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger mx-1"
                    onClick={() => handleDelete(payment.PaymentID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsPage;
