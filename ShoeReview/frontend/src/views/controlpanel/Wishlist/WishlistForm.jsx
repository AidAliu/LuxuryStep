import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const WishlistForm = () => {
  const { WishlistID } = useParams(); 
  const navigate = useNavigate();

  const [WishlistData, setWishlistData] = useState({
    User: "",
    name: "",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No access token found.");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/users/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (WishlistID) {
      const fetchWishlist = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("No access token found.");
          return;
        }

        setLoading(true);
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/wishlists/${WishlistID}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setWishlistData(response.data);
        } catch (err) {
          console.error("Error fetching Wishlist details:", err);
          setError("Failed to load Wishlist details");
        } finally {
          setLoading(false);
        }
      };
      fetchWishlist();
    }
  }, [WishlistID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWishlistData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("No access token found.");
      return;
    }

    try {
      setLoading(true);

      if (WishlistID) {
        // Update existing Wishlist
        await axios.put(
          `http://127.0.0.1:8000/api/wishlists/${WishlistID}/`,
          WishlistData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Wishlist updated successfully!");
      } else {
        // Create new Wishlist
        await axios.post(`http://127.0.0.1:8000/api/wishlists/`, WishlistData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Wishlist created successfully!");
      }

      navigate("/wishlists"); 
    } catch (err) {
      console.error("Error saving Wishlist:", err);
      setError("Failed to save Wishlist");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h1>{WishlistID ? "Edit Wishlist" : "Create Wishlist"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
      <label htmlFor="User" className="form-label">
            User
          </label>
          <select
            className="form-control"
            id="User"
            name="User"
            value={WishlistData.User}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a user
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={WishlistData.name}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {WishlistID ? "Update Wishlist" : "Create Wishlist"}
        </button>
      </form>
    </div>
  );
};

export default WishlistForm;
