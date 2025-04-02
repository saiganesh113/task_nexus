import React, { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existing = state.find((item) => item.id === action.payload.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      }
      return [...state, action.payload];

    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload);

    case "UPDATE_CART_ITEM":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  const addToCart = (pizza) => {
    dispatch({ type: "ADD_TO_CART", payload: pizza });
  };

  const removeFromCart = (pizzaId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: pizzaId });
  };

  const updateCartItem = (itemId, newQuantity) => {
    dispatch({ type: "UPDATE_CART_ITEM", payload: { id: itemId, quantity: newQuantity } });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartItem }}>
      {children}
    </CartContext.Provider>
  );
};
