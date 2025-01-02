import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OrderItemPage = () => {
  const [orderItems, setOrderItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderItems = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No access token found.");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/order-items/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrderItems(response.data);
      } catch (err) {
        console.error("Error fetching order items:", err);
      }
    };

    fetchOrderItems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order item?")) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("No access token found.");
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/order-items/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrderItems(orderItems.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting order item:", err);
    }
  };

  return (
    <div className="container">
      <h1>Manage Order Items</h1>
      <button className="btn btn-primary mb-3" onClick={() => navigate("/order-items/new")}>
        Add New Order Item
      </button>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Order</th>
              <th>Shoe</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.Order}</td>
                <td>{item.Shoe}</td>
                <td>{item.quantity}</td>
                <td>${item.price}</td>
                <td>
                  <button
                    className="btn btn-warning mx-1"
                    onClick={() => navigate(`/order-items/edit/${item.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger mx-1"
                    onClick={() => handleDelete(item.id)}
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

export default OrderItemPage;
