import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/cart.css"; 

const Cart = () => {
  const [order, setOrder] = useState(null);
  const [shoeDetails, setShoeDetails] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveOrder = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("You must be logged in to view your cart.");

        const response = await axios.get("http://127.0.0.1:8000/api/orders/active/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const activeOrder = response.data;
        setOrder(activeOrder);

        const detailedShoes = {};
        for (const item of activeOrder.items) {
          const shoeResponse = await axios.get(
            `http://127.0.0.1:8000/api/shoes/${item.Shoe}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          detailedShoes[item.Shoe] = shoeResponse.data;
        }

        setShoeDetails(detailedShoes);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveOrder();
  }, []);

  const handleRemoveItem = async (orderItemId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("You must be logged in to remove items.");

      await axios.delete(`http://127.0.0.1:8000/api/orders/remove/${orderItemId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrder((prevOrder) => ({
        ...prevOrder,
        items: prevOrder.items.filter((item) => item.id !== orderItemId),
      }));
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to remove item.");
    }
  };

  const handleCheckout = () => {
    if (!order || !order.OrderID) {
      setError("No active order found.");
      return;
    }
    navigate(`/purchaseshoe/${order.OrderID}`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {order?.items?.length > 0 ? (
        <div className="cart-items">
          {order.items.map((item) => {
            const shoe = shoeDetails[item.Shoe];
            const imageUrl = shoe?.image_url
              ? `http://127.0.0.1:8000${shoe.image_url}`
              : "http://127.0.0.1:8000/media/default_image.jpg";

            return (
              <div key={item.id} className="cart-item">
                <img src={imageUrl} alt={shoe?.name || "No Name"} />
                <div className="item-details">
                  <h5>{shoe?.name || "No Name"}</h5>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <p>
                    <strong>Price per Item:</strong> $
                    {(Number(item.price) / Number(item.quantity)).toFixed(2)}
                  </p>
                  <p>
                    <strong>Total:</strong> ${item.price}
                  </p>
                  <button className="btn-remove" onClick={() => handleRemoveItem(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-cart">Your cart is empty.</div>
      )}
      {order?.items?.length > 0 && (
        <div className="checkout-section">
          <h4>Total: ${Number(order?.total_price || 0).toFixed(2)}</h4>
          <button className="btn-checkout" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
