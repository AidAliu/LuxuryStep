import React, { useEffect, useState } from "react";
import { getShoes, deleteShoe } from "../utils/api";

const ShoeDashboard = () => {
    const [shoes, setShoes] = useState([]);

    useEffect(() => {
        const fetchShoes = async () => {
            try {
                const data = await getShoes();
                setShoes(data);
            } catch (error) {
                console.error("Error fetching shoes:", error);
            }
        };

        fetchShoes();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteShoe(id);
            setShoes(shoes.filter((shoe) => shoe.id !== id));
            alert("Shoe deleted successfully!");
        } catch (error) {
            console.error("Error deleting shoe:", error);
            alert("Failed to delete shoe!");
        }
    };

    return (
        <div>
            <h1>Shoe Dashboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {shoes.map((shoe) => (
                        <tr key={shoe.id}>
                            <td>{shoe.name}</td>
                            <td>${shoe.price}</td>
                            <td>{shoe.stock}</td>
                            <td>
                                <button onClick={() => handleDelete(shoe.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShoeDashboard;
