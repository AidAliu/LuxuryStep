import React from "react";

export const Contact = (props) => {
  return (
    <div>
      <div id="contact">
        <div className="container">
          <div className="row">
            {/* Centering Contact Info */}
            <div className="col-md-12 text-center">
              <div className="contact-info">
                <h3>Contact Info</h3>
                <div className="contact-items">
                  <p>
                    <span>
                      <i className="fa fa-map-marker"></i> Address
                    </span>
                    10000 Prishtina, Kosovo
                  </p>
                  <p>
                    <span>
                      <i className="fa fa-phone"></i> Phone
                    </span>
                    +383 45 999 111
                  </p>
                  <p>
                    <span>
                      <i className="fa fa-envelope-o"></i> Email
                    </span>
                    luxurystep@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media and Copyright */}
          <div className="row">
            <div className="social text-center">
              <ul>
                <li>
                  <a href="https://facebook.com/yourpage">
                    <i className="fa fa-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/yourpage">
                    <i className="fa fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="https://youtube.com/yourpage">
                    <i className="fa fa-youtube"></i>
                  </a>
                </li>
              </ul>
              <p>Copyright © 2025 Luxury Step All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
