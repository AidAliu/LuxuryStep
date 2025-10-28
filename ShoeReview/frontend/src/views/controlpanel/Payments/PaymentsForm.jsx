import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

// Load the Stripe public key from environment variable
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Step 1: Get the client secret from the backend
            const { data } = await axios.post('http://127.0.0.1:8000/api/create-payment-intent/', { amount });

            // Step 2: Confirm the payment with the client secret
            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                setError(result.error.message);
            } else if (result.paymentIntent.status === 'succeeded') {
                alert('Payment successful!');
                setAmount('');
            }
        } catch (err) {
            setError('Payment failed');
            console.error('Payment error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Pay with Stripe</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Card Details</label>
                    <CardElement />
                </div>
                <button type="submit" disabled={loading || !stripe || !elements}>
                    {loading ? 'Processing...' : 'Pay Now'}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

const PaymentForm = () => (
    <Elements stripe={stripePromise}>
        <CheckoutForm />
    </Elements>
);

export default PaymentForm;
