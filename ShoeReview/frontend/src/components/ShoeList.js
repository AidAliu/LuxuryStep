import React, { useEffect, useState } from "react";
import { getShoes } from "../utils/api";

const ShoeList = () => {
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

    return (
        <div>
            <h2>Shoe List</h2>
            <ul>
                {shoes.map((shoe) => (
                    <li key={shoe.id}>
                        <strong>{shoe.name}</strong> - ${shoe.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ShoeList;
