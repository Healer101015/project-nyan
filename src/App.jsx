import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ClientInfo from "./pages/ClientInfo";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import PrivateRouteAdmin from "./components/PrivateRouteAdmin";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import Admin from "./pages/Admin";

import { ThemeProvider } from "@material-tailwind/react";  // Import necessário

export default function App() {
  return (
    <ThemeProvider>  {/* Envolve todo o escopo */}
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <ClientInfo />
                  </PrivateRoute>
                }
              />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              <Route
                path="/admin"
                element={
                  <PrivateRouteAdmin>
                    <Admin />
                  </PrivateRouteAdmin>
                }
              />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
