// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "@material-tailwind/react";

// Páginas Principais
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

// NOVAS PÁGINAS DO PROJECT NYAN
import MangaDetails from "./pages/MangaDetails";
import Profile from "./pages/Profile";

// Componentes de Rota
import PrivateRoute from "./components/PrivateRoute";
import PrivateRouteAdmin from "./components/PrivateRouteAdmin";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Novas Rotas do Project Nyan */}
            <Route path="/manga/:id" element={<MangaDetails />} />
            <Route path="/profile/:login" element={<Profile />} />

            {/* Rotas Admin */}
            <Route
              path="/admin"
              element={
                <PrivateRouteAdmin>
                  <Admin />
                </PrivateRouteAdmin>
              }
            />

            {/* Você pode adicionar rotas privadas para "configurações", etc. */}
            {/* <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} /> */}
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}