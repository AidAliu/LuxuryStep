import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BrandPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No access token found.");
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/brands/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBrands(response.data);
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Failed to load brands");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleDelete = async (BrandID) => {

    const confirmDelete = window.confirm('Are you sure you want to delete this brand?')
    if (!confirmDelete) {
        return;
    }



    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("No access token found.");
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/brands/${BrandID}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBrands(brands.filter((brand) => brand.BrandID !== BrandID));
      alert("Brand deleted successfully!");
    } catch (err) {
      console.error("Error deleting brand:", err);
      alert("Failed to delete brand");
    }
  };

  const handleEdit = (BrandID) => {
    navigate(`/brands/edit/${BrandID}`);
  };

  const handleAdd = () => {
    navigate(`/brands/new`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h1>Brands</h1>
      <button className="btn btn-primary mb-3" onClick={handleAdd}>
        Add New Brand
      </button>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Website</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.BrandID}>
                <td>{brand.BrandID}</td>
                <td>{brand.name}</td>
                <td>{brand.description}</td>
                <td>
                  <a href={brand.website_url} target="_blank" rel="noopener noreferrer">
                    {brand.website_url}
                  </a>
                </td>
                <td>
                  <button
                    className="btn btn-warning mx-1"
                    onClick={() => handleEdit(brand.BrandID)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger mx-1"
                    onClick={() => handleDelete(brand.BrandID)}
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

export default BrandPage;
