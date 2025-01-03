import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const WishlistItemPage = () => {
  const [WishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlistItems = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No access token found.");
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/wishlistitems/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistItems(response.data);
      } catch (err) {
        console.error("Error fetching WishlistItems:", err);
        setError("Failed to load WishlistItems");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistItems();
  }, []);

  const handleDelete = async (WishlistItemID) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this WishlistItem?"
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
      await axios.delete(`http://127.0.0.1:8000/api/wishlistitems/${WishlistItemID}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistItems(WishlistItems.filter((WishlistItem) => WishlistItem.id !== WishlistItemID));
      alert("WishlistItem deleted successfully!");
    } catch (err) {
      console.error("Error deleting WishlistItem:", err);
      alert("Failed to delete WishlistItem");
    }
  };

  const handleEdit = (WishlistItemID) => {
    navigate(`/wishlistitems/edit/${WishlistItemID}`);
  };

  const handleAdd = () => {
    navigate(`/wishlistitems/new`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h1>WishlistItems</h1>
      <button className="btn btn-primary mb-3" onClick={handleAdd}>
        Add New WishlistItem
      </button>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Wishlist</th>
              <th>Shoe</th>
            </tr>
          </thead>
          <tbody>
            {WishlistItems.map((WishlistItem) => (
              <tr key={WishlistItem.id}>
                <td>{WishlistItem.id}</td>
                <td>{WishlistItem.wishlist_name}</td>
                <td>{WishlistItem.shoe_name}</td>
                <td>
                  <button
                    className="btn btn-warning mx-1"
                    onClick={() => handleEdit(WishlistItem.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger mx-1"
                    onClick={() => handleDelete(WishlistItem.id)}
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

export default WishlistItemPage;
