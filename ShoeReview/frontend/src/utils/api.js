import axios from "axios";

// Get shoes
export const getShoes = async () => {
    const response = await axios.get("http://127.0.0.1:8000/api/shoes/");
    return response.data;
};

// Create a shoe
export const createShoe = async (data) => {
    const response = await axios.post("http://127.0.0.1:8000/api/shoes/", data);
    return response.data;
};

// Delete a shoe
export const deleteShoe = async (id) => {
    const response = await axios.delete(`http://127.0.0.1:8000/api/shoes/${id}/`);
    return response.data;
};
