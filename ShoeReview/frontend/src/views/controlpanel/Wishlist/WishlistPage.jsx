import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const WishlistPage = () => {
  const [Wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlists = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No access token found.");
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/wishlists/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlists(response.data);
      } catch (err) {
        console.error("Error fetching Wishlists:", err);
        setError("Failed to load Wishlists");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlists();
  }, []);

  const handleDelete = async (WishlistID) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Wishlist?"
    );
    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("No access token found.");
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/wishlists/${WishlistID}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlists(Wishlists.filter((Wishlist) => Wishlist.WishlistID !== WishlistID));
      alert("Wishlist deleted successfully!");
    } catch (err) {
      console.error("Error deleting Wishlist:", err);
      alert("Failed to delete Wishlist");
    }
  };

  const handleEdit = (WishlistID) => {
    navigate(`/wishlists/edit/${WishlistID}`);
  };

  const handleAdd = () => {
    navigate(`/wishlists/new`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h1>Wishlists</h1>
      <button className="btn btn-primary mb-3" onClick={handleAdd}>
        Add New Wishlist
      </button>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {Wishlists.map((Wishlist) => (
              <tr key={Wishlist.WishlistID}>
                <td>{Wishlist.WishlistID}</td>
                <td>{Wishlist.username}</td>
                <td>{Wishlist.name}</td>
                <td>
                  <button
                    className="btn btn-warning mx-1"
                    onClick={() => handleEdit(Wishlist.WishlistID)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger mx-1"
                    onClick={() => handleDelete(Wishlist.WishlistID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WishlistPage;
