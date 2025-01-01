import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BrandForm = () => {
  const { BrandID } = useParams(); // Get the ID from the URL (if any)
  const navigate = useNavigate();

  const [brandData, setBrandData] = useState({
    name: "",
    description: "",
    website_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing brand data if BrandID is present
  useEffect(() => {
    if (BrandID) {
      const fetchBrand = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("No access token found.");
          return;
        }

        setLoading(true);
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/brands/${BrandID}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setBrandData(response.data);
        } catch (err) {
          console.error("Error fetching brand details:", err);
          setError("Failed to load brand details");
        } finally {
          setLoading(false);
        }
      };
      fetchBrand();
    }
  }, [BrandID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrandData((prevData) => ({ ...prevData, [name]: value }));
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

      if (BrandID) {
        // Update existing brand
        await axios.put(
          `http://127.0.0.1:8000/api/brands/${BrandID}/`,
          brandData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Brand updated successfully!");
      } else {
        // Create new brand
        await axios.post(`http://127.0.0.1:8000/api/brands/`, brandData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Brand created successfully!");
      }

      navigate("/brands"); // Redirect to brands list
    } catch (err) {
      console.error("Error saving brand:", err);
      setError("Failed to save brand");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h1>{BrandID ? "Edit Brand" : "Create Brand"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={brandData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={brandData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="website_url">Website URL</label>
          <input
            type="url"
            className="form-control"
            id="website_url"
            name="website_url"
            value={brandData.website_url}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {BrandID ? "Update Brand" : "Create Brand"}
        </button>
      </form>
    </div>
  );
};

export default BrandForm;
