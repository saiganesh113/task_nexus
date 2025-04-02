import React, { useReducer, useEffect } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import "./BuildPizza.css";

const initialState = {
    ingredientsList: [],
    selectedIngredients: [],
    totalCost: 0,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_INGREDIENTS":
            return { ...state, ingredientsList: action.payload };
        case "ADD_INGREDIENT":
            if (state.selectedIngredients.find((ing) => ing.id === action.payload.id)) {
                return state;
            }
            return {
                ...state,
                selectedIngredients: [...state.selectedIngredients, action.payload],
                totalCost: state.totalCost + action.payload.price,
            };
        case "REMOVE_INGREDIENT":
            return {
                ...state,
                selectedIngredients: state.selectedIngredients.filter((ing) => ing.id !== action.payload.id),
                totalCost: state.totalCost - action.payload.price,
            };
        case "RESET_SELECTION":
            return { ...state, selectedIngredients: [], totalCost: 0 };
        default:
            return state;
    }
};

const BuildPizza = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/ingredients");
                dispatch({ type: "SET_INGREDIENTS", payload: response.data });
            } catch (error) {
                console.error("Error fetching ingredients:", error);
            }
        };
        fetchIngredients();
    }, []);

    const handleAddIngredient = (ingredient) => {
        dispatch({ type: "ADD_INGREDIENT", payload: ingredient });
    };

    const handleRemoveIngredient = (ingredient) => {
        dispatch({ type: "REMOVE_INGREDIENT", payload: ingredient });
    };

    const handleAddToCart = () => {
        const pizza = {
            id: Date.now(),
            type: "build",
            tname: "Custom Pizza",
            selectedIngredients: state.selectedIngredients.map((ing) => ing.tname),
            price: state.totalCost,
            quantity: 1,
        };

        addToCart(pizza);
        alert("Custom Pizza added to cart!");
        dispatch({ type: "RESET_SELECTION" });
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Build Your Pizza</h2>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Ingredient</th>
                            <th>Price</th>
                            <th>Add</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.ingredientsList.map((ingredient) => (
                            <tr key={ingredient.id}>
                                <td>
                                    <img
                                        src={ingredient.image}
                                        alt={ingredient.tname}
                                        style={{ width: "50px", height: "50px" }}
                                    />
                                </td>
                                <td>{ingredient.tname}</td>
                                <td>₹{ingredient.price.toFixed(2)}</td>
                                <td>
                                    <button
                                        onClick={() => handleAddIngredient(ingredient)}
                                        disabled={state.selectedIngredients.find((ing) => ing.id === ingredient.id)}
                                        className="btn btn-sm btn-success"
                                    >
                                        Add
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4">
                <h4>Selected Ingredients:</h4>
                {state.selectedIngredients.length > 0 ? (
                    <ul>
                        {state.selectedIngredients.map((ingredient) => (
                            <li key={ingredient.id}>
                                {ingredient.tname} - ₹{ingredient.price.toFixed(2)}
                                <button
                                    onClick={() => handleRemoveIngredient(ingredient)}
                                    className="btn btn-sm btn-danger ml-2"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No ingredients selected.</p>
                )}
            </div>
            <div className="mt-4">
                <p>
                    <strong>Total Cost:</strong> ₹{state.totalCost.toFixed(2)}
                </p>
                <button
                    onClick={handleAddToCart}
                    disabled={state.selectedIngredients.length === 0}
                    className="btn btn-primary"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default BuildPizza;
