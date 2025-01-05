import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [error, setError] = useState(null);

  const isLoggedIn = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!isLoggedIn) {
      alert("You need to be logged in to view your wishlist!");
      navigate("/login");
      return;
    }

    const fetchWishlistItems = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/wishlist-items/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        setWishlistItems(response.data);
      } catch (err) {
        console.error("Error fetching wishlist items:", err);
        setError("Failed to load wishlist items.");
      }
    };

    fetchWishlistItems();
  }, [isLoggedIn, navigate]);

  return (
    <div className="container">
      <h1>Your Wishlist</h1>
      {error && <p className="text-danger">{error}</p>}
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ul>
          {wishlistItems.map((item) => (
            <li key={item.id}>
              <strong>{item.shoe_name}</strong>
              <p>{item.shoe_description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;