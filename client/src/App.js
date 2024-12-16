import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; // Import CartProvider
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BuildPizza from "./pages/BuildPizza";
import OrdersPage from "./pages/OrdersPage";
import CartPage from "./pages/CartPage";

function App() {
    return (
        <CartProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/build" element={<BuildPizza />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/cart" element={<CartPage />} />
                </Routes>
                <Footer />
            </Router>
        </CartProvider>
    );
}

export default App;
