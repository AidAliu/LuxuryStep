import React, { useState } from "react";
import { createShoe } from "../utils/api";

const ShoeForm = () => {
    const [formData, setFormData] = useState({
        Name: "",
        Brand: 1,
        Style: 1,
        Category: 1,
        Price: "",
        Size: "",
        Stock: "",
        Description: "",
        ImageUrl: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createShoe(formData);
        alert("Shoe added successfully!");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="Name"
                placeholder="Name"
                onChange={handleChange}
            />
            <input
                type="number"
                name="Price"
                placeholder="Price"
                onChange={handleChange}
            />
            <input
                type="number"
                name="Brand"
                placeholder="Brand"
                onChange={handleChange}
            />
            <input
                type="number"
                name="Category"
                placeholder="Category"
                onChange={handleChange}
            />
            <input
                type="number"
                name="Style"
                placeholder="Style"
                onChange={handleChange}
            />
            <input
                type="number"
                name="Size"
                placeholder="Size"
                onChange={handleChange}
            />
            <input
                type="number"
                name="Stock"
                placeholder="Stock"
                onChange={handleChange}
            />
            <input
                type="text"
                name="Description"
                placeholder="Description"
                onChange={handleChange}
            />
            <input
                type="text"
                name="ImageURL"
                placeholder="ImageURL"
                onChange={handleChange}
            />
            <button type="submit">Add Shoe</button>
        </form>
    );
};

export default ShoeForm;
