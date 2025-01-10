import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/wishlist.css"; // Make sure to use a new stylesheet for Wishlist

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("You must be logged in to view your wishlist.");

        const response = await axios.get("http://127.0.0.1:8000/api/wishlistitems/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setWishlistItems(response.data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError(err.response?.data?.detail || "Failed to fetch wishlist. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistItems();
  }, []);

  const handleDelete = async (itemId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("You must be logged in to delete items.");

      await axios.delete(`http://127.0.0.1:8000/api/wishlistitems/${itemId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Error deleting item:", err);
      setError(err.response?.data?.detail || "Failed to delete item. Please try again.");
    }
  };

  const isLoggedIn = localStorage.getItem("accessToken");

  const handlePurchase = async (ShoeID, itemId) => {
    if (!isLoggedIn) {
      alert("You need to be logged in to make a purchase!");
      navigate("/login");
      return;
    }
  
    try {
      const token = localStorage.getItem("accessToken");
  
      if (!token) {
        throw new Error("Authorization token is missing");
      }
  
      const payload = { shoe_id: ShoeID, quantity: 1 };
  
      // Add shoe to active order
      await axios.post("http://127.0.0.1:8000/api/orders/add/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Remove the item from the wishlist
      await axios.delete(`http://127.0.0.1:8000/api/wishlistitems/${itemId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert("Shoe added to your cart!");
      navigate("/cart"); // Redirect to cart
    } catch (err) {
      console.error("Error processing the purchase:", err);
      alert("Failed to process the purchase. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="wishlist-container mt-5">
      <h2 className="text-center mb-4">Your Wishlist</h2>
      {wishlistItems.length > 0 ? (
        <div className="wishlist-items row">
          {wishlistItems.map((item) => {
            const imageUrl = item.image_url
              ? `http://127.0.0.1:8000${item.image_url}`
              : "http://127.0.0.1:8000/media/default_image.jpg";

            return (
              <div key={item.id} className="wishlist-item col-lg-4 col-md-6 col-sm-12 mb-4">
                <div className="wishlist-shoe-card">
                  <div className="wishlist-shoe-image">
                    <img
                      src={imageUrl}
                      alt={item.shoe_name || "No Name Available"}
                      className="card-img-top"
                      style={{
                        maxHeight: "200px",
                        objectFit: "cover",
                        borderBottom: "1px solid #ddd",
                      }}
                    />
                    <div className="wishlist-overlay">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Remove Item
                      </button>
                      <button
                        className="btn btn-primary mx-2"
                        onClick={() => handlePurchase(item.Shoe, item.id)} 
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{item.shoe_name}</h5>
                    <p className="card-text">
                      <strong>Price:</strong> ${item.price || "N/A"} <br />
                      <strong>Size:</strong> {item.size || "N/A"} <br />
                      <strong>Stock:</strong> {item.stock || "Out of stock"} <br />
                      <strong>Description:</strong> {item.description || "No description available"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center">
          <div className="alert alert-info">Your wishlist is empty.</div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
