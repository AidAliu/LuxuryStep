import React, { useState, useEffect } from "react";
import axios from "axios";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]); // State to hold the items in the wishlist
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("You must be logged in to view your wishlist.");
          return;
        }
        
        // Log the token to verify it's being retrieved
        console.log("Access Token:", token);
  
        const response = await axios.get("http://127.0.0.1:8000/api/wishlistitems/", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("Response Data:", response.data); // Debugging: Inspect response
        setWishlistItems(response.data); // Set the wishlist items
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError("Failed to fetch wishlist. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchWishlistItems();
  }, []);
  
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-5">
  <h2 className="text-center mb-4">Your Wishlist</h2>
  {wishlistItems.length > 0 ? (
    <div className="row">
      {wishlistItems.map((item, index) => {
        const key = item.id || `${index}`;
        const imageUrl = item.image_url
          ? item.image_url.startsWith("/media/")
            ? `http://127.0.0.1:8000${item.image_url}`
            : `http://127.0.0.1:8000/media/${item.image_url}`
          : "http://127.0.0.1:8000/media/default_image.jpg"; // Fallback for missing image

        return (
          <div key={key} className="col-lg-6 col-md-6 col-sm-12 mb-4">
            <div
              className="card border rounded shadow-sm p-3"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              {/* Image Section */}
              <div className="image-container" style={{ flex: "1 1 auto" }}>
                <img
                  src={imageUrl}
                  alt={item.shoe_name || "No Name Available"}
                  className="img-fluid rounded"
                  style={{
                    maxWidth: "150px",
                    maxHeight: "150px",
                    objectFit: "cover",
                    border: "1px solid #ddd",
                  }}
                />
              </div>

              {/* Text Section */}
              <div className="details-container" style={{ flex: "2 1 auto" }}>
                <h5 className="card-title text-dark mb-2">
                  {item.shoe_name}
                </h5>
                <p className="mb-1">
                  <strong>Price:</strong> ${item.price || "N/A"}
                </p>
                <p className="mb-1">
                  <strong>Size:</strong> {item.size || "N/A"}
                </p>
                <p className="mb-1">
                  <strong>Stock:</strong> {item.stock || "Out of stock"}
                </p>
                <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                  {item.description || "No description available"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="alert alert-info text-center">Your wishlist is empty.</div>
  )}
</div>

  );
};

export default Wishlist;
