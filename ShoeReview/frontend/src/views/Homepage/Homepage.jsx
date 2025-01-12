import React, { useState, useEffect } from "react";
import { Navigation } from "../../components/navigation";
import { Header } from "../../components/header";
import { Features } from "../../components/features";
import { About } from "../../components/about";
import { Services } from "../../components/services";
import  Gallery  from "../../components/gallery";
import { Contact } from "../../components/contact";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Homepage = () => {
  const { ShoeID } = useParams(); 
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const addToWishlist = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("You must be logged in to add items to your wishlist."); 
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
          "http://127.0.0.1:8000/api/wishlistitems/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const existingItem = wishlistItemsResponse.data.find(
          (item) => item.Shoe === ShoeID
        );

        if (existingItem) {
          setError("This shoe is already in your wishlist.");
          alert("This shoe is already in your wishlist.");
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
        navigate("/"); // Navigate to home or relevant page
      } else {
        setError("No wishlist found for the user.");
        navigate("/")
      }
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      navigate("/")
      setError("Failed to add to wishlist. Please try again later.");
      alert("This Shoe is Already in your Wishlist.");
    } finally {
      setLoading(false);
      navigate("/");
      
    }
  };

  useEffect(() => {
    if (ShoeID) {
      addToWishlist(); 
    }
  }, [ShoeID]);

  return (
    <div>
      <Navigation />
      <Header />
      <Gallery />
      <Features />
      <Services />
      <About />
      <Contact />
    </div>
  );
};

export default Homepage;
