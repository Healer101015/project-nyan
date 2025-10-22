import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Importe seu AuthProvider

// Importar Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MangaDetails from './pages/MangaDetails';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import MangaReader from './pages/MangaReader'; // Nova página do Leitor

// Importar Componentes de Rota
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute'; // Rota protegida por login
import PrivateRouteAdmin from './components/PrivateRouteAdmin'; // Rota protegida por admin

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Detalhes do Mangá */}
              <Route path="/manga/:id" element={<MangaDetails />} />

              {/* Leitor de Mangá (Requer Login) */}
              <Route
                path="/manga/:id/read"
                element={
                  <PrivateRoute>
                    <MangaReader />
                  </PrivateRoute>
                }
              />

              {/* Perfil (Requer Login) */}
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

              {/* Admin (Requer Login e Admin) */}
              <Route
                path="/admin"
                element={
                  <PrivateRouteAdmin>
                    <Admin />
                  </PrivateRouteAdmin>
                }
              />

              {/* Adicione outras rotas (ex: 404) aqui */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;