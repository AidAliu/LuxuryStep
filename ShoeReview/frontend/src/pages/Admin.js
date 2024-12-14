import React from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Admin Panel</h1>
            <button onClick={() => navigate("/shoes")}>View Shoes</button>
            <button onClick={() => navigate("/create-shoe")}>Create Shoe</button>
        </div>
    );
};

export default Admin;
