import React from "react";
import { useCart } from "../context/CartContext";
import download from '../assets/download.jpeg';

const CartPage = () => {
  const { cartItems, removeFromCart, updateCartItem } = useCart(); // Assuming you have updateCartItem function

  // Separate Build Pizza and Order Pizza items
  const buildPizzas = cartItems.filter((item) => item.type === "build");
  const orderPizzas = cartItems.filter((item) => item.type === "order");

  // Calculate totals
  const buildTotal = buildPizzas.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  const orderTotal = orderPizzas.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  const grandTotal = buildTotal + orderTotal;

  const handleQuantityChange = (itemId, action) => {
    // Find the item in the cart
    const item = cartItems.find((item) => item.id === itemId);

    if (item) {
      let newQuantity = item.quantity || 1;
      newQuantity = action === "increment" ? newQuantity + 1 : Math.max(newQuantity - 1, 1); // Ensure quantity doesn't go below 1
      
      updateCartItem(itemId, newQuantity); // Update the item quantity in the cart
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Cart Items</h2>

      {/* Build Pizza Section */}
      <div className="mt-4">
        <h3>Build Pizza</h3>
        {buildPizzas.length > 0 ? (
          <div className="row">
            {buildPizzas.map((item) => (
              <div key={item.id} className="col-md-6 mb-4">
                <div className="card">
                  <img
                    src={download}
                    alt={item.name}
                    className="card-img-top"
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">
                      Ingredients: {item.selectedIngredients?.join(", ") || "None"} <br />
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleQuantityChange(item.id, "decrement")}
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity || 1}</span>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleQuantityChange(item.id, "increment")}
                        >
                          +
                        </button>
                      </div>
                      <br />
                      Price (each): ₹{item.price} <br />
                      Total: ₹{item.price * (item.quantity || 1)}
                    </p>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No custom pizzas in your cart.</p>
        )}
        <h4>Total (Build Pizza): ₹{buildTotal}</h4>
      </div>

      {/* Order Pizza Section */}
      <div className="mt-4">
        <h3>Order Pizza</h3>
        {orderPizzas.length > 0 ? (
          <div className="row">
            {orderPizzas.map((item) => (
              <div key={item.id} className="col-md-6 mb-4">
                <div className="card">
                  <img
                    src={item.image || "/default-pizza.jpg"} // Default image if none provided
                    alt={item.name}
                    className="card-img-top"
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleQuantityChange(item.id, "decrement")}
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity || 1}</span>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleQuantityChange(item.id, "increment")}
                        >
                          +
                        </button>
                      </div>
                      <br />
                      Quantity: {item.quantity || 1} <br />
                      Price (each): ₹{item.price} <br />
                      Total: ₹{item.price * (item.quantity || 1)}
                    </p>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No ordered pizzas in your cart.</p>
        )}
        <h4>Total (Order Pizza): ₹{orderTotal}</h4>
      </div>

      {/* Grand Total */}
      <div className="text-center mt-4">
        <h3>Grand Total: ₹{grandTotal}</h3>
      </div>
    </div>
  );
};

export default CartPage;
