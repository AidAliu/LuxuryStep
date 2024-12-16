import React from "react";

export const About = () => {
  return (
    <div id="about">
      <div className="container">
        <div className="row">
          {/* Image Section */}
          <div className="col-xs-12 col-md-6">
            <img src="img/about.jpg" className="img-responsive" alt="About Us" />
          </div>

          {/* Text Section */}
          <div className="col-xs-12 col-md-6">
            <div className="about-text">
              <h2>About Us</h2>
              <p>
                At <b>LUXURYSTEP</b>, we bring sophistication to every step. Our
                mission is to redefine footwear by combining cutting-edge
                design, premium quality, and unmatched comfort. From daily wear
                to special occasions, we ensure your style stands out,
                effortlessly.
              </p>

              <h3>Why Choose Us?</h3>

              {/* Why Choose Us - List Section */}
              <div className="list-style">
                {/* Left Column */}
                <div className="col-lg-6 col-sm-6 col-xs-12">
                  <ul>
                    <li>Precision Craftsmanship</li>
                    <li>Premium Quality Materials</li>
                    <li>Unmatched Comfort</li>
                    <li>Timeless Elegance</li>
                  </ul>
                </div>

                {/* Right Column */}
                <div className="col-lg-6 col-sm-6 col-xs-12">
                  <ul>
                    <li>Versatile Styles for Every Occasion</li>
                    <li>Customer-Centric Service</li>
                    <li>Innovative Designs That Inspire</li>
                    <li>Worldwide Delivery</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
