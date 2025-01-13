import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import "./css/gallery.css";

const Gallery = () => {
  const [shoes, setShoes] = useState([]);
  const [ratings, setRatings] = useState({});
  const navigate = useNavigate();

  // Check if the user is logged in
  const isLoggedIn = localStorage.getItem("accessToken");

  // Fetch shoes and their average ratings
  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const shoesResponse = await axios.get("http://127.0.0.1:8000/api/shoes/");
        setShoes(shoesResponse.data);

        // Fetch average ratings for each shoe
        const ratingPromises = shoesResponse.data.map((shoe) =>
          axios
            .get(`http://127.0.0.1:8000/api/shoes/${shoe.ShoeID}/reviews/`)
            .then((res) => ({
              shoeID: shoe.ShoeID,
              averageRating: calculateAverageRating(res.data),
            }))
        );

        const ratingsData = await Promise.all(ratingPromises);
        const ratingsMap = ratingsData.reduce(
          (map, rating) => ({
            ...map,
            [rating.shoeID]: rating.averageRating,
          }),
          {}
        );
        setRatings(ratingsMap);
      } catch (error) {
        console.error("Error fetching shoes or ratings:", error);
      }
    };

    fetchShoes();
  }, []);


  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;

    const validReviews = reviews.filter((review) => review.rating >= 1 && review.rating <= 5);
    const totalRating = validReviews.reduce((sum, review) => sum + review.rating, 0);

    return validReviews.length > 0 ? (totalRating / validReviews.length).toFixed(1) : 0;
  };

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
        <div className="gallery-items">
          {shoes.reduce((rows, shoe, index) => {
            if (index % 4 === 0) rows.push([]);
            rows[rows.length - 1].push(shoe);
            return rows;
          }, []).map((row, rowIndex) => (
            <div className="row" key={rowIndex}>
              {row.map((shoe) => (
                <div
                  className="col-12 col-sm-6 col-md-4 col-lg-3 p-2"
                  key={shoe.ShoeID}
                >
                  <div className="shoe-card">
                    <div className="shoe-image">
                      <img
                        src={shoe.image_url.startsWith("/media/")
                          ? `http://127.0.0.1:8000${shoe.image_url}`
                          : `http://127.0.0.1:8000/media/${shoe.image_url}`}
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
                          Add to Cart
                        </button>
                      </div>
                    </div>
                    <h4>{shoe.name}</h4>
                    <p>{shoe.description}</p>
                    <p><strong>Price: ${shoe.price}</strong></p>
                    <div className="average-rating">
                  {ratings[shoe.ShoeID] ? (
                     <>
                  {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={20}
          color={star <= Math.round(ratings[shoe.ShoeID]) ? "#ffc107" : "#e4e5e9"}
        />
      ))}
      <p>{ratings[shoe.ShoeID]} out of 5</p>
    </>
  ) : (
    <p>No Reviews</p>
  )}
</div>

                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
};

export default Gallery;
