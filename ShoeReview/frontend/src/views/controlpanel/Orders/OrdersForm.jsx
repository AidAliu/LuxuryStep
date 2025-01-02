import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const OrdersForm = () => {
  const { OrderID } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // User: "",
    total_price: "",
    shipping_address: "",
    status: "Pending",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No access token found.");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/users/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (OrderID) {
      const fetchOrder = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("No access token found.");
          return;
        }

        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/orders/${OrderID}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setFormData(response.data);
        } catch (err) {
          console.error("Error fetching order:", err);
          setError("Failed to load order.");
        }
      };

      fetchOrder();
    }
  }, [OrderID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
        const payload = {
            // User: formData.User, 
            total_price: parseFloat(formData.total_price),
            shipping_address: formData.shipping_address,
            status: formData.status,
        };

        console.log("Payload to be sent:", payload);

        if (OrderID) {
            await axios.put(`http://127.0.0.1:8000/api/orders/${OrderID}/`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Order updated successfully!");
        } else {
            await axios.post(`http://127.0.0.1:8000/api/orders/`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Order created successfully!");
        }

        navigate("/orders");
    } catch (err) {
        console.error("Error saving order:", err);
        alert("Failed to save order.");
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="container py-4">
      <h1 className="text-center fw-bold text-primary">
        {OrderID ? "Edit Order" : "Create Order"}
      </h1>
      <form onSubmit={handleSubmit} className="form-group">
        
        <div className="mb-3">
          <label htmlFor="total_price" className="form-label">
            Total Price
          </label>
          <input
            type="number"
            className="form-control"
            id="total_price"
            name="total_price"
            value={formData.total_price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="shipping_address" className="form-label">
            Shipping Address
          </label>
          <textarea
            className="form-control"
            id="shipping_address"
            name="shipping_address"
            value={formData.shipping_address}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            className="form-control"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          {OrderID ? "Update Order" : "Create Order"}
        </button>
      </form>
    </div>
  );
};

export default OrdersForm;
