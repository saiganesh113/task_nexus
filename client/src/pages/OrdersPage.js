import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import "./OrdersPage.css";

const OrdersPage = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState({}); // Quantity per pizza ID

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/pizzas");
        setPizzas(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load pizza data.");
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  const handleQuantityChange = (pizzaId, action) => {
    setQuantities((prev) => {
      const currentQuantity = prev[pizzaId] || 0;
      const newQuantity =
        action === "increment" ? currentQuantity + 1 : Math.max(currentQuantity - 1, 0);
      return { ...prev, [pizzaId]: newQuantity };
    });
  };

  const handleAddToCart = () => {
    const selectedPizzas = pizzas
      .filter((pizza) => quantities[pizza.id] > 0)
      .map((pizza) => ({
        ...pizza,
        quantity: quantities[pizza.id],
        type: "order",
      }));
    selectedPizzas.forEach((pizza) => addToCart(pizza));
  };

  const selectedPizzas = pizzas.filter((pizza) => quantities[pizza.id] > 0);

  if (loading) {
    return <div className="text-center">Loading pizzas...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Our Pizzas</h2>
      <div className="row">
        {pizzas.map((pizza) => {
          const quantity = quantities[pizza.id] || 0;

          return (
            <div key={pizza.id} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src={pizza.image}
                      alt={pizza.name}
                      className="img-fluid rounded-start"
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{pizza.name}</h5>
                      <p className="card-text text-muted">{pizza.description}</p>
                      <p>
                        <strong>Ingredients:</strong> {pizza.ingredients.join(", ")}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-danger">₹{pizza.price}</span>
                        <div className="d-flex align-items-center">
                          {quantity > 0 ? (
                            <>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => handleQuantityChange(pizza.id, "decrement")}
                              >
                                -
                              </button>
                              <span className="mx-2">{quantity}</span>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => handleQuantityChange(pizza.id, "increment")}
                              >
                                +
                              </button>
                            </>
                          ) : (
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => handleQuantityChange(pizza.id, "increment")}
                            >
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <h4>Selected Pizzas:</h4>
        {selectedPizzas.length > 0 ? (
          <ul>
            {selectedPizzas.map((pizza) => (
              <li key={pizza.id}>
                {pizza.name} - ₹{(pizza.price * quantities[pizza.id]).toFixed(2)} (x
                {quantities[pizza.id]})
              </li>
            ))}
          </ul>
        ) : (
          <p>No pizzas selected.</p>
        )}
      </div>
      <div className="mt-4">
        <p>
          <strong>Total Cost:</strong> ₹
          {selectedPizzas
            .reduce((total, pizza) => total + pizza.price * quantities[pizza.id], 0)
            .toFixed(2)}
        </p>
        <button
          onClick={handleAddToCart}
          disabled={selectedPizzas.length === 0}
          className="btn btn-primary"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default OrdersPage;
