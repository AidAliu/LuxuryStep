import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ShoesPage = () => {
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShoes = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('No access token found.');
        navigate('/');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/shoes/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setShoes(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching shoes:', err);
        setError('Failed to load shoes data');
        setLoading(false);
      }
    };

    fetchShoes();
  }, [navigate]);

  const handleDelete = async (ShoeID) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('No access token found.');
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/shoes/${ShoeID}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShoes(shoes.filter((shoes) => shoes.ShoeID !== ShoeID));
    } catch (err) {
      console.error('Error deleting shoes:', err);
      alert('Failed to delete shoes');
    }
  };

  const handleAdd = () => {
    navigate('/shoes/new');
  };

  const handleEdit = (ShoeID) => {
    navigate(`/shoes/edit/${ShoeID}`);
  };

  if (loading) {
    return <div>Loading Shoes...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4 fw-bold text-danger">Manage Shoes</h1>

      <button className="btn btn-primary mb-3" onClick={handleAdd}>
        Create New Shoes
      </button>

      {shoes.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                {/* Adjust the columns you want to display */}
                <th>ID</th>
                <th>Name</th>
                <th>BrandID</th>
                <th>StyleID</th>
                <th>Price</th>
                <th>Size</th>
                <th>Stock</th>
                <th>Description</th>
                <th>Image_URL</th>
              </tr>
            </thead>
            <tbody>
              {shoes.map((shoes) => (
                <tr key={shoes.ShoeID}>
                  <td>{shoes.ShoeID}</td>
                  <td>{shoes.name}</td>
                  <td>{shoes.BrandID}</td>
                  <td>{shoes.StyleID}</td>
                  <td>{shoes.price}</td>
                  <td>{shoes.size}</td>
                  <td>{shoes.stock}</td>
                  <td>{shoes.description}</td>
                  <td>{shoes.image_url}</td>
                  <td>
                    <button
                      className="btn btn-warning mx-1"
                      onClick={() => handleEdit(shoes.ShoeID)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger mx-1"
                      onClick={() => handleDelete(shoes.ShoeID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No shoes available</p>
      )}
    </div>
  );
};

export default ShoesPage;
