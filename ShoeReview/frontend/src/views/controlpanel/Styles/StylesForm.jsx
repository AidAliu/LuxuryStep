import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const StyleForm = () => {
  const { StyleID } = useParams(); 
  const navigate = useNavigate();

  const [styleData, setStyleData] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (StyleID) {
      const fetchStyle = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("No access token found.");
          return;
        }

        setLoading(true);
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/styles/${StyleID}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setStyleData(response.data);
        } catch (err) {
          console.error("Error fetching style details:", err);
          setError("Failed to load style details");
        } finally {
          setLoading(false);
        }
      };
      fetchStyle();
    }
  }, [StyleID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStyleData((prevData) => ({ ...prevData, [name]: value }));
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

      if (StyleID) {
        // Update existing style
        await axios.put(
          `http://127.0.0.1:8000/api/styles/${StyleID}/`,
          styleData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Style updated successfully!");
      } else {
        // Create new style
        await axios.post(`http://127.0.0.1:8000/api/styles/`, styleData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Style created successfully!");
      }

      navigate("/styles"); 
    } catch (err) {
      console.error("Error saving style:", err);
      setError("Failed to save style");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h1>{StyleID ? "Edit Style" : "Create Style"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={styleData.name}
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
            value={styleData.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {StyleID ? "Update Style" : "Create Style"}
        </button>
      </form>
    </div>
  );
};

export default StyleForm;
