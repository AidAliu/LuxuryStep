import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const getShoes = async () => {
    const response = await axios.get(`${API_URL}/shoes/`);
    return response.data;
};

export const createShoe = async (shoeData) => {
    const response = await axios.post(`${API_URL}/shoes/`, shoeData);
    return response.data;
};
