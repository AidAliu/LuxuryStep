import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StylePage = () => {
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStyles = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No access token found.");
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/styles/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStyles(response.data);
      } catch (err) {
        console.error("Error fetching styles:", err);
        setError("Failed to load styles");
      } finally {
        setLoading(false);
      }
    };

    fetchStyles();
  }, []);

  const handleDelete = async (StyleID) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this style?"
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
      await axios.delete(`http://127.0.0.1:8000/api/styles/${StyleID}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStyles(styles.filter((style) => style.StyleID !== StyleID));
      alert("Style deleted successfully!");
    } catch (err) {
      console.error("Error deleting style:", err);
      alert("Failed to delete style");
    }
  };

  const handleEdit = (StyleID) => {
    navigate(`/styles/edit/${StyleID}`);
  };

  const handleAdd = () => {
    navigate(`/styles/new`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h1>Styles</h1>
      <button className="btn btn-primary mb-3" onClick={handleAdd}>
        Add New Style
      </button>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {styles.map((style) => (
              <tr key={style.StyleID}>
                <td>{style.StyleID}</td>
                <td>{style.name}</td>
                <td>{style.description}</td>
                <td>
                  <button
                    className="btn btn-warning mx-1"
                    onClick={() => handleEdit(style.StyleID)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger mx-1"
                    onClick={() => handleDelete(style.StyleID)}
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

export default StylePage;
