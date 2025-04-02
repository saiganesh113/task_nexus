import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios"; // Import axios
import { CartProvider } from "./context/CartContext"; // Import CartProvider
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BuildPizza from "./pages/BuildPizza";
import OrdersPage from "./pages/OrdersPage";
import CartPage from "./pages/CartPage";

function App() {
    useEffect(() => {
        const synchronizeData = async () => {
            try {
                const response = await axios.post('http://localhost:5000/api/synchronize');
                console.log(response.data.message);
            } catch (error) {
                console.error('Error synchronizing data:', error);
            }
        };

        // Call the synchronization function on component mount
        synchronizeData();
    }, []); // Empty dependency array to run only on mount

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
