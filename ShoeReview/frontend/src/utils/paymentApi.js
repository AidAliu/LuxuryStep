import axios from "axios";

// Adjust if your backend URL differs:
const PAYMENT_BASE_URL = "http://127.0.0.1:8000/api/payments/";

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('accessToken'); // Match the token name used in navigation
};

// Create axios instance with auth header
const createAuthenticatedRequest = () => {
  const token = getAuthToken();
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  };
};

export const createPaymentIntent = async (orderId) => {
  try {
    const response = await axios.post(
      `${PAYMENT_BASE_URL}intent/`,
      { order_id: orderId },
      createAuthenticatedRequest()
    );
    return response.data;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

export const confirmPayment = async (paymentIntentId, orderId) => {
  try {
    const response = await axios.post(
      `${PAYMENT_BASE_URL}confirm/`,
      { 
        payment_intent_id: paymentIntentId,
        order_id: orderId 
      },
      createAuthenticatedRequest()
    );
    return response.data;
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw error;
  }
};

// Legacy functions (keep for backward compatibility)
export const getPayments = async () => {
  try {
    const response = await axios.get(PAYMENT_BASE_URL, createAuthenticatedRequest());
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

export const createPayment = async (paymentData) => {
  try {
    const response = await axios.post(PAYMENT_BASE_URL, paymentData, createAuthenticatedRequest());
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

export const updatePayment = async (paymentId, paymentData) => {
  try {
    const response = await axios.put(
      `${PAYMENT_BASE_URL}${paymentId}/`, 
      paymentData, 
      createAuthenticatedRequest()
    );
    return response.data;
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
};

export const deletePayment = async (paymentId) => {
  try {
    const response = await axios.delete(
      `${PAYMENT_BASE_URL}${paymentId}/`, 
      createAuthenticatedRequest()
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting payment:", error);
    throw error;
  }
};
