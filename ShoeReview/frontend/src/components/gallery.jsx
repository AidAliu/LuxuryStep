import React, { useEffect, useState } from "react";
import axios from "axios";
import { Image } from "./image"; 

export const Gallery = (props) => {
  const [shoes, setShoes] = useState([]); // State to store shoe data

  // Fetch shoes from the backend API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/shoes/") // API endpoint to fetch shoes
      .then((response) => setShoes(response.data))
      .catch((error) => console.error("Error fetching shoes:", error));
  }, []);

  return (
    <div id="portfolio" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Shoe Gallery</h2>
          <p>Explore our collection of shoes below.</p>
        </div>
        <div className="row">
          <div className="gallery-items">
            {shoes.map((shoe) => (
              <div className="col-sm-6 col-md-4 col-lg-4" key={shoe.ShoeID}>
                <div className="shoe-card">
                  <Image src={shoe.image_url} alt={shoe.name} />
                  <h4>{shoe.name}</h4>
                  <p>{shoe.description}</p>
                  <p>Price: ${shoe.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
