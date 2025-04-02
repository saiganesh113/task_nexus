import React, { useReducer, useEffect } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import "./OrdersPage.css";

const initialState = {
  pizzas: [],
  loading: true,
  error: null,
  quantities: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PIZZAS":
      return { ...state, pizzas: action.payload, loading: false };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "CHANGE_QUANTITY":
      return {
        ...state,
        quantities: {
          ...state.quantities,
          [action.payload.pizzaId]: Math.max(
            (state.quantities[action.payload.pizzaId] || 0) + action.payload.value,
            0
          ),
        },
      };
    default:
      return state;
  }
};

const OrdersPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/pizzas");
        dispatch({ type: "SET_PIZZAS", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to load pizza data." });
      }
    };
    fetchPizzas();
  }, []);

  const handleQuantityChange = (pizzaId, value) => {
    dispatch({ type: "CHANGE_QUANTITY", payload: { pizzaId, value } });
  };

  const handleAddToCart = () => {
    const selectedPizzas = state.pizzas
      .filter((pizza) => state.quantities[pizza.id] > 0)
      .map((pizza) => ({
        ...pizza,
        quantity: state.quantities[pizza.id],
        type: "order",
      }));
    selectedPizzas.forEach((pizza) => addToCart(pizza));

    alert("Your pizzas have been added to the cart!");
  };

  const selectedPizzas = state.pizzas.filter((pizza) => state.quantities[pizza.id] > 0);

  if (state.loading) return <div className="text-center">Loading pizzas...</div>;
  if (state.error) return <div className="text-center text-danger">{state.error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Our Pizzas</h2>
      <div className="row">
        {state.pizzas.map((pizza) => {
          const quantity = state.quantities[pizza.id] || 0;
          return (
            <div key={pizza.id} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img src={pizza.image} alt={pizza.name} className="img-fluid rounded-start" />
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
                              <button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantityChange(pizza.id, -1)}>
                                -
                              </button>
                              <span className="mx-2">{quantity}</span>
                              <button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantityChange(pizza.id, 1)}>
                                +
                              </button>
                            </>
                          ) : (
                            <button className="btn btn-warning btn-sm" onClick={() => handleQuantityChange(pizza.id, 1)}>
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
                {pizza.name} - ₹{(pizza.price * state.quantities[pizza.id]).toFixed(2)} (x{state.quantities[pizza.id]})
              </li>
            ))}
          </ul>
        ) : (
          <p>No pizzas selected.</p>
        )}
      </div>
      <div className="mt-4">
        <p>
          <strong>Total Cost:</strong> ₹{selectedPizzas.reduce((total, pizza) => total + pizza.price * state.quantities[pizza.id], 0).toFixed(2)}
        </p>
        <button onClick={handleAddToCart} disabled={selectedPizzas.length === 0} className="btn btn-primary">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default OrdersPage;
