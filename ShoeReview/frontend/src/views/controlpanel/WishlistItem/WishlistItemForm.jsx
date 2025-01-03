import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const WishlistItemForm = () => {
  const { WishlistItemID } = useParams();
  const navigate = useNavigate();

  const [WishlistItemData, setWishlistItemData] = useState({
    Wishlist: "",
    Shoe: "",
  });
  const [wishlists, setWishlists] = useState([]);
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("No access token found.");
      return;
    }

    const fetchOptions = async () => {
      try {
        const [wishlistResponse, shoeResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/wishlists/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/api/shoes/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setWishlists(wishlistResponse.data);
        setShoes(shoeResponse.data);
      } catch (err) {
        console.error("Error fetching options:", err);
        setError("Failed to load wishlists or shoes");
      }
    };

    const fetchWishlistItem = async () => {
      if (!WishlistItemID) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `http://127.0.0.1:8000/api/wishlistitems/${WishlistItemID}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlistItemData(response.data);
      } catch (err) {
        console.error("Error fetching WishlistItem details:", err);
        setError("Failed to load WishlistItem details");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
    fetchWishlistItem();
  }, [WishlistItemID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWishlistItemData((prevData) => ({ ...prevData, [name]: value }));
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

      if (WishlistItemID) {
        await axios.put(
          `http://127.0.0.1:8000/api/wishlistitems/${WishlistItemID}/`,
          WishlistItemData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("WishlistItem updated successfully!");
      } else {
        await axios.post(`http://127.0.0.1:8000/api/wishlistitems/`, WishlistItemData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("WishlistItem created successfully!");
      }

      navigate("/wishlistitems");
    } catch (err) {
      console.error("Error saving WishlistItem:", err);
      setError("Failed to save WishlistItem");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h1>{WishlistItemID ? "Edit WishlistItem" : "Create WishlistItem"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="Wishlist" className="form-label">
            Wishlist
          </label>
          <select
            className="form-control"
            id="Wishlist"
            name="Wishlist"
            value={WishlistItemData.Wishlist}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a wishlist
            </option>
            {wishlists.map((wishlist) => (
              <option key={wishlist.WishlistID} value={wishlist.WishlistID}>
                {wishlist.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="Shoe" className="form-label">
            Shoe
          </label>
          <select
            className="form-control"
            id="Shoe"
            name="Shoe"
            value={WishlistItemData.Shoe}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a shoe
            </option>
            {shoes.map((shoe) => (
              <option key={shoe.ShoeID} value={shoe.ShoeID}>
                {shoe.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          {WishlistItemID ? "Update WishlistItem" : "Create WishlistItem"}
        </button>
      </form>
    </div>
  );
};

export default WishlistItemForm;
