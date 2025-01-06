import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Wishlist = () => {
  const { ShoeID } = useParams(); // Get ShoeID from URL
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const addToWishlist = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("You must be logged in to add to your wishlist.");
        navigate("/login");
        return;
      }

      // Fetch the user's wishlist
      const response = await axios.get("http://127.0.0.1:8000/api/wishlists/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const userWishlist = response.data[0]; // Assuming one wishlist per user
        setWishlist(userWishlist);

        // Check if the shoe is already in the wishlist
        const wishlistItemsResponse = await axios.get(
          `http://127.0.0.1:8000/api/wishlistitems/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const existingItem = wishlistItemsResponse.data.find(
          (item) => item.Shoe === ShoeID
        );

        if (existingItem) {
          setError("This shoe is already in your wishlist.");
          return; // Don't add the shoe again if it's already in the wishlist
        }

        // Add the Shoe to the wishlist
        const addResponse = await axios.post(
          "http://127.0.0.1:8000/api/wishlistitems/",
          {
            Wishlist: userWishlist.WishlistID,
            Shoe: ShoeID,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Shoe added to wishlist successfully!");
        navigate("/"); // Navigate to home or a relevant page
      } else {
        setError("No wishlist found for the user.");
      }
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      setError("Failed to add to wishlist. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  addToWishlist();
}, [ShoeID, navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return <div>{wishlist ? <p>Shoe added to your wishlist!</p> : <p>No wishlist found.</p>}</div>;
};

export default Wishlist;
