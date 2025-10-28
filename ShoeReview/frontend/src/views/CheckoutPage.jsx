import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StripePayment from '../components/StripePayment';
import axios from 'axios';

const CheckoutPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(
          `http://127.0.0.1:8000/api/orders/${orderId}/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }
        );
        setOrder(response.data);
      } catch (error) {
        setError('Failed to load order details');
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent);
    // Redirect to success page or order confirmation
    navigate(`/order-confirmation/${orderId}`);
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setError('Payment failed. Please try again.');
  };

  if (loading) {
    return (
      <div className="checkout-container">
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-container">
        <div className="error">{error}</div>
        <button onClick={() => navigate('/orders')}>Back to Orders</button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="checkout-container">
        <div className="error">Order not found</div>
        <button onClick={() => navigate('/orders')}>Back to Orders</button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-details">
            <p><strong>Order ID:</strong> {order.OrderID}</p>
            <p><strong>Total Amount:</strong> ${order.total_price}</p>
            <p><strong>Status:</strong> {order.status}</p>
            
            {order.items && order.items.length > 0 && (
              <div className="order-items">
                <h4>Items:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{item.Shoe?.name || 'Shoe'} x {item.quantity}</span>
                    <span>${item.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="payment-section">
          <StripePayment
            orderId={orderId}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </div>
      </div>

      <style jsx>{`
        .checkout-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .checkout-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: start;
        }

        .order-summary {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
        }

        .order-summary h2 {
          margin-bottom: 20px;
          color: #333;
        }

        .order-details p {
          margin: 10px 0;
          font-size: 16px;
        }

        .order-items {
          margin-top: 20px;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }

        .loading, .error {
          text-align: center;
          padding: 40px;
          font-size: 18px;
        }

        .error {
          color: #e74c3c;
        }

        button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        }

        button:hover {
          background-color: #0056b3;
        }

        @media (max-width: 768px) {
          .checkout-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;