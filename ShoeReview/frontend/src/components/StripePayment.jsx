import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { createPaymentIntent, confirmPayment } from '../utils/paymentApi';
import './css/StripePayment.css';

// Load Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ orderId, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    // Create payment intent when component mounts
    const initializePayment = async () => {
      try {
        const response = await createPaymentIntent(orderId);
        setClientSecret(response.clientSecret);
      } catch (error) {
        setPaymentError('Failed to initialize payment');
        onPaymentError && onPaymentError(error);
      }
    };

    if (orderId) {
      initializePayment();
    }
  }, [orderId, onPaymentError]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsLoading(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (error) {
        setPaymentError(error.message);
        onPaymentError && onPaymentError(error);
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment with your backend
        await confirmPayment(paymentIntent.id, orderId);
        onPaymentSuccess && onPaymentSuccess(paymentIntent);
      }
    } catch (error) {
      setPaymentError('Payment failed. Please try again.');
      onPaymentError && onPaymentError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="card-element-container">
        <CardElement options={cardElementOptions} />
      </div>
      
      {paymentError && (
        <div className="payment-error">
          {paymentError}
        </div>
      )}
      
      <button 
        type="submit" 
        disabled={!stripe || isLoading || !clientSecret}
        className="pay-button"
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const StripePayment = ({ orderId, onPaymentSuccess, onPaymentError }) => {
  return (
    <Elements stripe={stripePromise}>
      <div className="stripe-payment-container">
        <h3>Payment Details</h3>
        <CheckoutForm 
          orderId={orderId}
          onPaymentSuccess={onPaymentSuccess}
          onPaymentError={onPaymentError}
        />
      </div>
    </Elements>
  );
};

export default StripePayment;