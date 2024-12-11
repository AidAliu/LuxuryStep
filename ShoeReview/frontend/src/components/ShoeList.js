import React, { useState, useEffect } from "react";
import { getShoes } from "../api";

const ShoeList = () => {
    const [shoes, setShoes] = useState([]);

    useEffect(() => {
        const fetchShoes = async () => {
            const data = await getShoes();
            setShoes(data);
        };
        fetchShoes();
    }, []);

    return (
        <div>
            <h1>Shoe List</h1>
            <ul>
                {shoes.map((shoe) => (
                    <li key={shoe.id}>
                        {shoe.Name} - ${shoe.Price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ShoeList;
