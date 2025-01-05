import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Gallery = (props) => {
  const [shoes, setShoes] = useState([]); // State to store shoe data
  const navigate = useNavigate();
  // Fetch shoes from the backend API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/shoes/") // API endpoint for shoes
      .then((response) => setShoes(response.data))
      .catch((error) => console.error("Error fetching shoes:", error));
  }, []);

  const handleReview = (ShoeID) => {
    navigate(`/reviewshoe/${ShoeID}`);
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
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div className="shoe-card" style={{ textAlign: "center" }}>
                  <img
                    src={
                      shoe.image_url.startsWith("/media/")
                        ? `http://127.0.0.1:8000${shoe.image_url}`
                        : `http://127.0.0.1:8000/media/${shoe.image_url}`
                    } // Correctly handle URL paths
                    alt={shoe.name}
                    style={{
                      maxWidth: "100%",
                      height: "200px", // Adjust the height
                      objectFit: "cover", // Crop if needed
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/200"; // Fallback image
                    }}
                  />
                  <h4 style={{ fontSize: "1.2rem", marginBottom: "5px" }}>
                    {shoe.name}
                  </h4>
                  <p style={{ fontSize: "0.9rem", color: "#555", marginBottom: "5px" }}>
                    {shoe.description}
                  </p>
                  <p style={{ fontWeight: "bold", color: "#000" }}>
                    Price: ${shoe.price}
                  </p>
                  <buton
                  className="btn btn-primary mx-2"
                  onClick={() => handleReview(shoe.ShoeID)}
                  >
                    Review
                  </buton>
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
