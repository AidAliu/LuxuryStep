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

  const [brands, setBrands] = useState([]); // Store available brands
  const [styles, setStyles] = useState([]); // Store available styles
  const [imageFile, setImageFile] = useState(null); // State to store the uploaded file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing shoe data and available brands/styles if ShoeID is present
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No access token found.");
        return;
      }

      try {
        setLoading(true);

        // Fetch brands and styles
        const [brandsResponse, stylesResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/brands/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/api/styles/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setBrands(brandsResponse.data);
        setStyles(stylesResponse.data);

        // Fetch shoe details if editing
        if (ShoeID) {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/shoes/${ShoeID}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const shoe = response.data;
          setShoeData({
            name: shoe.name || "",
            BrandID: shoe.BrandID.id || "", // Ensure the correct structure
            StyleID: shoe.StyleID.id || "",
            price: shoe.price || "",
            size: shoe.size || "",
            stock: shoe.stock || "",
            description: shoe.description || "",
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load form data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    formData.append("BrandID", parseInt(shoeData.BrandID)); // Ensure integer IDs
    formData.append("StyleID", parseInt(shoeData.StyleID)); // Ensure integer IDs
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
      console.error("Error saving shoe:", err.response?.data || err.message);
      setError(
        err.response?.data || "Failed to save shoe. Check the input fields."
      );
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
          <label htmlFor="BrandID">Brand</label>
          <select
            className="form-control"
            id="BrandID"
            name="BrandID"
            value={shoeData.BrandID}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a brand
            </option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="StyleID">Style</label>
          <select
            className="form-control"
            id="StyleID"
            name="StyleID"
            value={shoeData.StyleID}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a style
            </option>
            {styles.map((style) => (
              <option key={style.id} value={style.id}>
                {style.name}
              </option>
            ))}
          </select>
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
