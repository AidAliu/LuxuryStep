import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/gallery.css";

export const Gallery = () => {
  const [shoes, setShoes] = useState([]);
  const navigate = useNavigate();

  // Check if the user is logged in
  const isLoggedIn = localStorage.getItem("accessToken");

  // Fetch shoes from the backend API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/shoes/")
      .then((response) => setShoes(response.data))
      .catch((error) => console.error("Error fetching shoes:", error));
  }, []);

  const handlePurchase = async (ShoeID) => {
    if (!isLoggedIn) {
      alert("You need to be logged in to make a purchase!");
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      const payload = { shoe_id: ShoeID, quantity: 1 };

      // Add shoe to active order
      await axios.post("http://127.0.0.1:8000/api/orders/add/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Shoe added to your cart!");
      navigate("/cart"); // Redirect to cart
    } catch (err) {
      console.error("Error adding shoe to cart:", err);
      alert("Failed to add shoe to cart. Please try again.");
    }
  };

  const handleReview = (ShoeID) => {
    if (!isLoggedIn) {
      alert("You need to be logged in to leave a review!");
      navigate("/login");
    } else {
      navigate(`/reviewshoe/${ShoeID}`);
    }
  };

  const handleWishlist = (ShoeID) => {
    if (!isLoggedIn) {
      alert("You need to be logged in to add items to your wishlist!");
      navigate("/login");
    } else {
      console.log(`Wishlist button clicked for Shoe ID: ${ShoeID}`);
      navigate(`/${ShoeID}`);
    }
  };

  return (
    <div id="portfolio" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Shoe Gallery</h2>
          <p>Explore our collection of shoes below.</p>
        </div>
        <div className="row">
          <div className="gallery-items d-flex flex-wrap justify-content-center">
            {shoes.map((shoe) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3 p-2"
                key={shoe.ShoeID}
              >
                <div className="shoe-card">
                  <div className="shoe-image">
                    <img
                      src={shoe.image_url.startsWith("/media/") ? `http://127.0.0.1:8000${shoe.image_url}` : `http://127.0.0.1:8000/media/${shoe.image_url}`}
                      alt={shoe.name}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/200";
                      }}
                    />
                    <div className="overlay">
                      <button
                        className="btn btn-success"
                        onClick={() => handleWishlist(shoe.ShoeID)}
                      >
                        Add to Wishlist
                      </button>
                      <button
                        className="btn btn-secondary mx-2"
                        onClick={() => handleReview(shoe.ShoeID)}
                      >
                        Add a Review
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => handlePurchase(shoe.ShoeID)}
                      >
                        Purchase
                      </button>
                    </div>
                  </div>
                  <h4>{shoe.name}</h4>
                  <p>{shoe.description}</p>
                  <p><strong>Price: ${shoe.price}</strong></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
