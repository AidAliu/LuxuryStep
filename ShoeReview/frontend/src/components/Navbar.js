import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav style={{ background: "#1877F2", padding: "10px" }}>
            <h2 style={{ color: "white" }}>ShoeReview</h2>
            <ul style={{ listStyle: "none", display: "flex", gap: "15px" }}>
                <li>
                    <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/admin" style={{ color: "white", textDecoration: "none" }}>
                        Admin
                    </Link>
                </li>
                <li>
                    <Link to="/create-shoe" style={{ color: "white", textDecoration: "none" }}>
                        Create Shoe
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
