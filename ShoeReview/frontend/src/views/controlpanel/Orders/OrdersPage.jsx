import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No access token found.");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/orders/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders.");
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("No access token found.");
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/orders/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.filter((order) => order.id !== id));
      alert("Order deleted successfully!");
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete order.");
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center fw-bold text-primary">Manage Orders</h1>
      <button
        className="btn btn-success my-3"
        onClick={() => navigate("/orders/new")}
      >
        Add New Order
      </button>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Total Price</th>
            <th>Shipping Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.User}</td>
              <td>{order.total_price}</td>
              <td>{order.shipping_address}</td>
              <td>{order.status}</td>
              <td>
                <button
                  className="btn btn-warning mx-1"
                  onClick={() => navigate(`/orders/edit/${order.id}`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger mx-1"
                  onClick={() => handleDelete(order.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
