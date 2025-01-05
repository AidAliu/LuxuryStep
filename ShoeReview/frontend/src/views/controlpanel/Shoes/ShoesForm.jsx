import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ShoesForm = () => {
  const { ShoeID } = useParams(); // Get the ID from the URL (if any)
  const navigate = useNavigate();

  const [shoeData, setShoeData] = useState({
    name: "",
    BrandID: "",
    StyleID: "",
    price: "",
    size: "",
    stock: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null); // State to store the uploaded file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing shoe data if ShoeID is present
  useEffect(() => {
    if (ShoeID) {
      const fetchShoe = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("No access token found.");
          return;
        }

        setLoading(true);
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/shoes/${ShoeID}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const shoe = response.data;
          setShoeData({
            name: shoe.name || "",
            BrandID: shoe.BrandID || "",
            StyleID: shoe.StyleID || "",
            price: shoe.price || "",
            size: shoe.size || "",
            stock: shoe.stock || "",
            description: shoe.description || "",
          });
        } catch (err) {
          console.error("Error fetching shoe details:", err);
          setError("Failed to load shoe details");
        } finally {
          setLoading(false);
        }
      };
      fetchShoe();
    }
  }, [ShoeID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShoeData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); // Store the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("No access token found.");
      return;
    }

    const formData = new FormData();
    formData.append("name", shoeData.name);
    formData.append("BrandID", shoeData.BrandID);
    formData.append("StyleID", shoeData.StyleID);
    formData.append("price", shoeData.price);
    formData.append("size", shoeData.size);
    formData.append("stock", shoeData.stock);
    formData.append("description", shoeData.description);

    if (imageFile) {
      formData.append("image_url", imageFile); // Attach the image file
    }

    try {
      setLoading(true);

      if (ShoeID) {
        // Update existing shoe
        await axios.put(
          `http://127.0.0.1:8000/api/shoes/${ShoeID}/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Shoe updated successfully!");
      } else {
        // Create new shoe
        await axios.post(`http://127.0.0.1:8000/api/shoes/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Shoe created successfully!");
      }

      navigate("/shoes"); // Redirect to shoes list
    } catch (err) {
      console.error("Error saving shoe:", err);
      setError("Failed to save shoe");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h1>{ShoeID ? "Edit Shoe" : "Create Shoe"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={shoeData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="BrandID">Brand ID</label>
          <input
            type="number"
            className="form-control"
            id="BrandID"
            name="BrandID"
            value={shoeData.BrandID}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="StyleID">Style ID</label>
          <input
            type="number"
            className="form-control"
            id="StyleID"
            name="StyleID"
            value={shoeData.StyleID}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={shoeData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="size">Size</label>
          <input
            type="number"
            className="form-control"
            id="size"
            name="size"
            value={shoeData.size}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            className="form-control"
            id="stock"
            name="stock"
            value={shoeData.stock}
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
            value={shoeData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image_url">Image</label>
          <input
            type="file"
            className="form-control"
            id="image_url"
            name="image_url"
            onChange={handleFileChange} 
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {ShoeID ? "Update Shoe" : "Create Shoe"}
        </button>
      </form>
    </div>
  );
};

export default ShoesForm;
