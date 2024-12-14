import React, { useState } from "react";
import { createShoe } from "../utils/api";

const CreateShoe = () => {
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        style: "",
        category: "",
        price: "",
        size: "",
        stock: "",
        description: "",
        image_url: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createShoe(formData);
            alert("Shoe created successfully!");
        } catch (error) {
            console.error("Error creating shoe:", error);
            alert("Failed to create shoe!");
        }
    };

    return (
        <div>
            <h1>Create Shoe</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="brand"
                    placeholder="Brand ID"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="style"
                    placeholder="Style ID"
                    value={formData.style}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category ID"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="size"
                    placeholder="Size"
                    value={formData.size}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                ></textarea>
                <input
                    type="url"
                    name="image_url"
                    placeholder="Image URL"
                    value={formData.image_url}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Create Shoe</button>
            </form>
        </div>
    );
};

export default CreateShoe;
