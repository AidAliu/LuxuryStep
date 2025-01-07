import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const [order, setOrder] = useState(null); // Store active order
  const [shoeDetails, setShoeDetails] = useState({}); // Store detailed shoe info
  const [error, setError] = useState(null); // Error handling
  const [loading, setLoading] = useState(true); // Loading state
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

        // Fetch detailed information for all shoes in the order
        const detailedShoes = {};
        for (const item of activeOrder.items) {
          const shoeResponse = await axios.get(
            `http://127.0.0.1:8000/api/shoes/${item.Shoe}/`, // Fetch shoe by its ID
            { headers: { Authorization: `Bearer ${token}` } }
          );
          detailedShoes[item.Shoe] = shoeResponse.data;
        }

        setShoeDetails(detailedShoes);
      } catch (err) {
        console.error("Error fetching active order:", err);
        setError(err.response?.data?.detail || "Failed to fetch cart. Please try again.");
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

      // Refresh the cart after item removal
      setOrder((prevOrder) => ({
        ...prevOrder,
        items: prevOrder.items.filter((item) => item.id !== orderItemId),
      }));
    } catch (err) {
      console.error("Error removing item:", err);
      setError(err.response?.data?.detail || "Failed to remove item. Please try again.");
    }
  };

  const handleCheckout = () => {
    navigate(`/order/checkout/${order.id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="cart-container mt-5">
      <h2 className="text-center mb-4">Your Cart</h2>
      {order?.items?.length > 0 ? (
        <div className="cart-items row">
          {order.items.map((item) => {
            const shoe = shoeDetails[item.Shoe]; // Access detailed shoe data
            const imageUrl = shoe?.image_url
              ? `http://127.0.0.1:8000${shoe.image_url}`
              : "http://127.0.0.1:8000/media/default_image.jpg";

            return (
              <div key={item.id} className="cart-item col-lg-4 col-md-6 col-sm-12 mb-4">
                <div className="cart-item-card">
                  <div className="cart-item-image">
                    <img
                      src={imageUrl}
                      alt={shoe?.name || "No Name Available"}
                      className="card-img-top"
                      style={{
                        maxHeight: "200px",
                        objectFit: "cover",
                        borderBottom: "1px solid #ddd",
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{shoe?.name || "No Name Available"}</h5>
                    <p className="card-text">
                      <strong>Quantity:</strong> {item.quantity} <br />
                      <strong>Price:</strong> ${(Number(item.price) / Number(item.quantity)).toFixed(2)} <br />
                      <strong>Total:</strong> ${item.price}
                    </p>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center">
          <div className="alert alert-info">Your cart is empty.</div>
        </div>
      )}
      {order?.items?.length > 0 && (
        <div className="text-center mt-4">
          <h4>Total Price: ${Number(order?.total_price || 0).toFixed(2)}</h4>
          <button className="btn btn-success" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
