// src/App.js
import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Cities from "./pages/Cities/Cities";
import CityDetail from "./pages/Cities/CityDetails";
import Restaurants from "./pages/Restaurants/Restaurants";
import Accommodations from "./pages/Accomodation/Accomodation";
import Bookings from "./pages/Bookings/Bookings";
import Favorites from "./pages/Favorites/Favorites";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Registration";
import "./styles/variables.css";
import { useState, useEffect } from "react";
import Auth from "./pages/Auth/Auth";

const PrivateRoute = ({ children }) => {
    const { user } = React.useContext(AuthContext);
    return user ? children : <Navigate to="/login" replace />;
};

function App() {
    const [cities, setCities] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8000/TripMeUpApp/")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setCities(data); // list of city objects
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setError("Failed to fetch from Django API.");
            });
    }, []);

    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Auth />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/cities" element={<Cities />} />
                    <Route path="/cities/:title" element={<CityDetail />} />
                    <Route path="/restaurants" element={<Restaurants />} />
                    <Route
                        path="/accommodations"
                        element={
                            <PrivateRoute>
                                <Accommodations />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/bookings"
                        element={
                            <PrivateRoute>
                                <Bookings />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/favorites"
                        element={
                            <PrivateRoute>
                                <Favorites />
                            </PrivateRoute>
                        }
                    />
                </Routes>
                <Footer />
            </AuthProvider>
        </Router>
    );
}

export default App;
