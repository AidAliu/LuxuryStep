import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";

export const Navigation = () => {
  // Hooks at the top (same order on every render)
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Fetch user data if there's a token
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/api/me/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Error fetching user info:", err);
      });
  }, []);

  // Hide Nav on /login or /register
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/");
  };

  return (
    <nav
      id="menu"
      className="navbar navbar-default navbar-fixed-top"
      style={{ minHeight: "50px" }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0",
        }}
      >
        <a
          className="navbar-brand page-scroll"
          href="#page-top"
          style={{
            margin: 0,
            padding: "10px 0",
            fontWeight: "600",
            letterSpacing: "0.5px",
          }}
        >
          LuxuryStep
        </a>

        <div style={{ display: "flex", alignItems: "center" }}>
          <ul
            className="nav navbar-nav"
            style={{ marginBottom: 0, display: "flex", alignItems: "center" }}
          >
            <li>
              <a
                href="#portfolio"
                className="page-scroll"
                style={{ padding: "10px 15px" }}
              >
                Gallery
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="page-scroll"
                style={{ padding: "10px 15px" }}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="page-scroll"
                style={{ padding: "10px 15px" }}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="page-scroll"
                style={{ padding: "10px 15px" }}
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="page-scroll"
                style={{ padding: "10px 15px" }}
              >
                Contact
              </a>
            </li>

            {/* If user is logged in -> Show username & logout. Otherwise -> Show LOGIN / REGISTER. */}
            {user ? (
              <>
                <div style={{ display: "flex", gap: "10px", marginLeft: "20px" }}>
                  <span>Hello, {user.username}</span>
                  <button
                    onClick={handleLogout}
                    style={{
                      color: "#333",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "5px 12px",
                      fontSize: "14px",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    LOGOUT
                  </button>
                </div>

                {/* Show Control Panel button if user is logged in and is an admin */}
                {user.is_staff && (
                  <li style={{ marginLeft: "15px" }}>
                    <button
                      onClick={() => navigate("/controlpanel")}
                      className="btn btn-danger" // Bootstrap red button class
                      style={{
                        color: "#fff",
                        fontSize: "14px",
                        padding: "5px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Control Panel
                    </button>
                  </li>
                )}
              </>
            ) : (
              <div style={{ display: "flex", gap: "10px", marginLeft: "20px" }}>
                <Link
                  to="/login"
                  style={{
                    textDecoration: "none",
                    color: "#333",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "5px 12px",
                    fontSize: "14px",
                    backgroundColor: "#fff",
                  }}
                >
                  LOGIN
                </Link>
                <Link
                  to="/register"
                  style={{
                    textDecoration: "none",
                    color: "#333",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "5px 12px",
                    fontSize: "14px",
                    backgroundColor: "#fff",
                  }}
                >
                  REGISTER
                </Link>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
