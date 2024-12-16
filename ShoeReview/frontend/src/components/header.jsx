import React from "react";
import PropTypes from "prop-types";

export const Header = ({ data }) => {
  return (
    <header id="header" role="banner">
      <div className="intro">
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
                <h1>
                Walk with Class. Leave a Legacy.
                  <span></span>
                </h1>
                <p>
                Discover the perfect balance of comfort, elegance, and timeless fashion. Walk with confidence, leave a legacy, and redefine your style – step into sophistication today.
                </p>
                <a
                  href="#features"
                  className="btn btn-custom btn-lg page-scroll"
                  aria-label="Learn more about our collections"
                >
                  Explore Collection
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// PropTypes to validate props
Header.propTypes = {
  data: PropTypes.shape({
    paragraph: PropTypes.string,
  }),
};


Header.defaultProps = {
  data: {
    paragraph:
      "Discover the perfect blend of comfort, elegance, and timeless fashion.",
  },
};
