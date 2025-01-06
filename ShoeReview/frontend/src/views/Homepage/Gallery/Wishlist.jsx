import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        // Fetch the token from localStorage
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("You must be logged in to view your wishlist.");
          navigate("/login");
          return;
        }

        // Make an API request to fetch the wishlist
        const response = await axios.get("http://127.0.0.1:8000/api/wishlists/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Validate the response and update state
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const userWishlist = response.data[0]; // Assuming one wishlist per user
          setWishlist(userWishlist);
          setWishlistItems(userWishlist.items || []); // Graceful handling if items are missing
        } else {
          setError("No wishlist data found.");
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized access. Please log in again.");
          navigate("/login");
        } else {
          setError("Failed to load wishlist. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate]);

  // Handle loading state
  if (loading) {
    return <p>Loading your wishlist...</p>;
  }

  // Handle error state
  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  // Render wishlist and wishlist items
  return (
    <div className="container">
      <h1>Your Wishlist</h1>
      {wishlist ? (
        <>
          <h2>{wishlist.name}</h2>
          {wishlistItems.length === 0 ? (
            <p>Your wishlist is empty.</p>
          ) : (
            <div className="wishlist-items row">
              {wishlistItems.map((item) => (
                <div key={item.id} className="wishlist-item card col-md-4 mb-4">
                  {item.shoe ? (
                    <>
                      <img
                        src={`http://127.0.0.1:8000${item.shoe.image_url}`}
                        alt={item.shoe.name}
                        className="card-img-top"
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{item.shoe.name}</h5>
                        <p className="card-text">{item.shoe.description}</p>
                        <p className="card-text">
                          <strong>Price:</strong> ${item.shoe.price}
                        </p>
                        <p className="card-text">
                          <strong>Size:</strong> {item.shoe.size}
                        </p>
                        <p className="card-text">
                          <strong>Stock:</strong> {item.shoe.stock}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p>Shoe details are unavailable.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p>No wishlist found.</p>
      )}
    </div>
  );
};

export default Wishlist;
