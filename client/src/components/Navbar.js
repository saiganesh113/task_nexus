import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Navbar.css";
import logo from "../assets/logo.png";

const Navbar = () => {
    const { cartItems = [] } = useCart();

    // Calculate total quantity of items in the cart
    const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-black">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img src={logo} alt="Pizzeria Logo" className="logo me-2" />
                    <h1 className="brand mb-0">Pizzeria</h1>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/orders">
                                Order Pizza
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/build">
                                Build Your Pizza
                            </Link>
                        </li>
                    </ul>

                    {/* Cart Button with Quantity Badge */}
                    <div className="ms-3 position-relative">
                        <Link
                            className="btn btn-warning cart-button text-decoration-none text-dark"
                            to="/cart"
                        >
                            🛒 Shopping Cart
                        </Link>
                        {totalQuantity > 0 && (
                            <span
                                className="badge bg-danger position-absolute top-0 start-100 translate-middle"
                                style={{ fontSize: "0.8rem" }}
                            >
                                {totalQuantity}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
