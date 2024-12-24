import axios from "axios";

// Adjust if your backend URL differs:
const PAYMENT_BASE_URL = "http://127.0.0.1:8000/api/payments/";

export const getPayments = async () => {
  try {
    const response = await axios.get(PAYMENT_BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

export const createPayment = async (paymentData) => {
  try {
    const response = await axios.post(PAYMENT_BASE_URL, paymentData);
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

export const updatePayment = async (paymentId, paymentData) => {
  try {
    const response = await axios.put(`${PAYMENT_BASE_URL}${paymentId}/`, paymentData);
    return response.data;
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
};

export const deletePayment = async (paymentId) => {
  try {
    const response = await axios.delete(`${PAYMENT_BASE_URL}${paymentId}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting payment:", error);
    throw error;
  }
};
