import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/shoes/";

// Get shoes
export const getShoes = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching shoes:", error);
        throw error;
    }
};

// Create a shoe
export const createShoe = async (data) => {
    try {
        const response = await axios.post(API_BASE_URL, data);
        return response.data;
    } catch (error) {
        console.error("Error creating shoe:", error);
        throw error;
    }
};

// Delete a shoe
export const deleteShoe = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}${id}/`);
        return response.data;
    } catch (error) {
        console.error("Error deleting shoe:", error);
        throw error;
    }
};
