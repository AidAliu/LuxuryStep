import React from "react";

export const Profile = (props) => {
  return (
    <section id="profile" className="profile-section">
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <div className="profile-content text-center">
              <h2 className="profile-title">User Profile</h2>
              <div className="profile-details">
                <p><strong>Name:</strong> John Doe</p>
                <p><strong>Email:</strong> johndoe@example.com</p>
                <p><strong>Location:</strong> Prishtina, Kosovo</p>
              </div>
              <div className="profile-actions">
                <button className="btn btn-primary">Edit Profile</button>
                <button className="btn btn-danger">Logout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
