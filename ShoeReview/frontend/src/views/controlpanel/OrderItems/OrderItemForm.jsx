import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const OrderItemForm = () => {
  const { OrderItemID } = useParams(); // Get the ID from the URL (if any)
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Order: "",
    Shoe: "",
    quantity: "",
    price: "",
  });

  const [orders, setOrders] = useState([]);
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No access token found.");
        return;
      }

      try {
        const [ordersResponse, shoesResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/orders/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/api/shoes/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setOrders(ordersResponse.data);
        setShoes(shoesResponse.data);
      } catch (err) {
        console.error("Error fetching options:", err);
        setError("Failed to load data.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (OrderItemID) {
      const fetchOrderItem = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("No access token found.");
          return;
        }

        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/order-items/${OrderItemID}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setFormData(response.data);
        } catch (err) {
          console.error("Error fetching order item:", err);
          setError("Failed to load order item.");
        }
      };

      fetchOrderItem();
    }
  }, [OrderItemID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      if (OrderItemID) {
        await axios.put(
          `http://127.0.0.1:8000/api/order-items/${OrderItemID}/`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Order item updated successfully.");
      } else {
        await axios.post("http://127.0.0.1:8000/api/order-items/", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Order item created successfully.");
      }
      navigate("/order-items");
    } catch (err) {
      console.error("Error saving order item:", err);
      setError("Failed to save order item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>{OrderItemID ? "Edit Order Item" : "Create Order Item"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="Order">Order</label>
          <select
            className="form-control"
            id="Order"
            name="Order"
            value={formData.Order}
            onChange={handleChange}
            required
          >
            <option value="">Select Order</option>
            {orders.map((order) => (
              <option key={order.OrderID} value={order.OrderID}>
                {order.OrderID}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="Shoe">Shoe</label>
          <select
            className="form-control"
            id="Shoe"
            name="Shoe"
            value={formData.Shoe.ShoeID}
            onChange={handleChange}
            required
          >
            <option value="">Select Shoe</option>
            {shoes.map((shoe) => (
              <option key={shoe.ShoeID} value={shoe.ShoeID}>
                {shoe.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            name="quantity"
            value={formData.quantity}
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
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {OrderItemID ? "Update Order Item" : "Create Order Item"}
        </button>
      </form>
    </div>
  );
};

export default OrderItemForm;
