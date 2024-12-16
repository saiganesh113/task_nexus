import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import "./BuildPizza.css";

const BuildPizza = () => {
    const [ingredientsList, setIngredientsList] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const { addToCart } = useCart();

    useEffect(() => {
        // Fetch ingredients from API
        const fetchIngredients = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/ingredients");
                setIngredientsList(response.data);
            } catch (error) {
                console.error("Error fetching ingredients:", error);
            }
        };
        fetchIngredients();
    }, []);

    const handleAddIngredient = (ingredient) => {
        if (!selectedIngredients.find((ing) => ing.id === ingredient.id)) {
            setSelectedIngredients([...selectedIngredients, ingredient]);
            setTotalCost((prevTotalCost) => prevTotalCost + ingredient.price);
        }
    };

    const handleRemoveIngredient = (ingredient) => {
        setSelectedIngredients((prevIngredients) =>
            prevIngredients.filter((ing) => ing.id !== ingredient.id)
        );
        setTotalCost((prevTotalCost) => prevTotalCost - ingredient.price);
    };

    const handleAddToCart = () => {
        const pizza = {
            id: Date.now(),
            type: "build",
            name: "Custom Pizza",
            selectedIngredients: selectedIngredients.map((ing) => ing.name), // Use "name" for ingredients
            price: totalCost,
            quantity: 1,
        };

        addToCart(pizza);
        alert("Custom Pizza added to cart!");
        setSelectedIngredients([]);
        setTotalCost(0);
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
                        {ingredientsList.map((ingredient) => (
                            <tr key={ingredient.id}>
                                <td>
                                    <img
                                        src={ingredient.image}
                                        alt={ingredient.name}
                                        style={{ width: "50px", height: "50px" }}
                                    />
                                </td>
                                <td>{ingredient.name}</td>
                                <td>₹{ingredient.price.toFixed(2)}</td>
                                <td>
                                    <button
                                        onClick={() => handleAddIngredient(ingredient)}
                                        disabled={selectedIngredients.find((ing) => ing.id === ingredient.id)}
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
                {selectedIngredients.length > 0 ? (
                    <ul>
                        {selectedIngredients.map((ingredient) => (
                            <li key={ingredient.id}>
                                {ingredient.name} - ₹{ingredient.price.toFixed(2)}
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
                    <strong>Total Cost:</strong> ₹{totalCost.toFixed(2)}
                </p>
                <button
                    onClick={handleAddToCart}
                    disabled={selectedIngredients.length === 0}
                    className="btn btn-primary"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default BuildPizza;
