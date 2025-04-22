import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
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
import CreateBooking from "./pages/Bookings/CreateBooking"
import Auth from "./pages/Auth/Auth";
import ScrollToTop from "./components/ScrollToTop"; 
import  NotFound from "./pages/NotFound404/404NotFound";
import styles from "./App.module.css";
import AdminBookings from './pages/Admin/AdminBookings';


const PrivateRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  const location = useLocation();
  const onAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className={styles.app}>
      <Navbar />

      <main
        className={`${styles.content} ${
          onAuthPage ? styles.centerContent : ""
        }`}
      >
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/admin-login" element={<Auth />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />

          <Route path="/" element={<Home />} />
          <Route path="/cities" element={
            <PrivateRoute><Cities /></PrivateRoute>} />
          <Route path="/cities/:title" element={
            <PrivateRoute><CityDetail /></PrivateRoute>} />
          <Route path="/restaurants" element={
            <PrivateRoute>
              <Restaurants />
            </PrivateRoute>} />
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
        
                    <Route path="*" element={<NotFound />} />

            <Route path="/create-booking" element={
                <PrivateRoute>
                <CreateBooking />
              </PrivateRoute>
            } />
        </Routes>

      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop /> 
        <AppContent />
      </AuthProvider>
    </Router>
  );
}